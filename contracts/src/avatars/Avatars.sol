// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "solidity-kit/solc_0_8/ERC721/implementations/EnumerableERC721.sol";

contract Avatars is EnumerableERC721 {
    error NotMinter(address sender, address minter);
    error NotMinterAdmin(address sender, address minterAdmin);

    event MinterSet(address indexed previousMinter, address indexed newMinter);

    /// @notice Who may change {minter}. Immutable, and set at construction.
    address public immutable MINTER_ADMIN;

    /// @notice The only address allowed to {mint}.
    ///
    /// Zero until set, and zero means NOBODY CAN MINT, which is the right
    /// default: a deployment that forgets to wire the sale mints nothing at
    /// all, rather than minting for free. The failure is loud and immediate
    /// instead of silent and expensive.
    address public minter;

    constructor(address minterAdmin) {
        MINTER_ADMIN = minterAdmin;
    }

    /// @notice Point the mint at a sale contract.
    ///
    /// Re-settable rather than one-shot, and that costs nothing in trust that
    /// is not already spent: `AvatarsSale` is deployed BEHIND AN UPGRADEABLE
    /// PROXY owned by the same admin, so an admin who wanted free avatars could
    /// already upgrade the sale to hand them out. Pretending a one-shot setter
    /// bought security here would be security theatre, and it would make
    /// changing how avatars are paid for a redeployment of this contract and a
    /// migration of every avatar in it.
    ///
    /// What it does buy is the thing this game actually wants next: paying in
    /// something other than the native token means deploying a different sale
    /// and pointing this at it. See the note on {mint}.
    function setMinter(address newMinter) external {
        if (msg.sender != MINTER_ADMIN) {
            revert NotMinterAdmin(msg.sender, MINTER_ADMIN);
        }
        emit MinterSet(minter, newMinter);
        minter = newMinter;
    }

    /// @notice Mint an avatar. Only the {minter} may call it.
    ///
    /// THIS USED TO HAVE NO ACCESS CONTROL, and it was the most serious thing
    /// in this repo. `BasicERC721._safeMint` only rejects a tokenID that
    /// already EXISTS, so anyone could mint any unminted id to any address, for
    /// free, without going near `AvatarsSale` - and the tokenID scheme is
    /// `(uint160(owner) << 96) + subID`, so they were well-formed avatars
    /// rather than odd-looking ones.
    ///
    /// The consequence that mattered was not the bypassed price. This NFT is
    /// the thing AT STAKE in the commit-reveal round, and **a stake that costs
    /// nothing to acquire is not a stake**: "something must be at stake, or
    /// nobody has to reveal" is the invariant the whole framework rests on (see
    /// AGENTS.md), and a free mint voided it on any deployment that carried it.
    /// A player who disliked what they had committed to could go quiet, lose
    /// the avatar, and mint another one for gas.
    ///
    /// WHAT PAYING MEANS LIVES IN THE SALE, NOT HERE, and that split is the
    /// point rather than an accident. This contract knows only that exactly one
    /// address may mint; `SaleViaNativePayment` knows the price, the recipient
    /// and the free-list. So charging in an ERC20 later is a new sale contract
    /// and one `setMinter` call, with no change to this file and no migration
    /// of existing avatars - `SaleViaERC20Payment.sol` is already in the tree
    /// for exactly that. Today it is the native token.
    ///
    /// ONE MINTER, NOT A SET, deliberately. A `mapping(address => bool)` would
    /// let a native sale and an ERC20 sale run at once, and nothing wants that
    /// yet; a speculative parameter shipped unexercised is the thing this
    /// project keeps having to delete. When two live sales are actually needed,
    /// this becomes a mapping, and that change is smaller than the migration a
    /// wrong guess would cost.
    ///
    /// NO LONGER `payable`, which is a second fix rather than tidying. It was
    /// `payable`, took `msg.value`, and did nothing with it - and neither this
    /// contract nor `EnumerableERC721` has any way to withdraw, so every wei
    /// ever sent to it was permanently locked. The sale takes the payment and
    /// forwards it to `RECIPIENT`; this call carries no value at all.
    ///
    /// See also docs/plans/identity-without-consent.md: this function was one
    /// half of the composed impersonation described there. Both halves are now
    /// closed.
    function mint(address to, uint256 tokenID, bytes calldata data) external {
        if (msg.sender != minter) {
            revert NotMinter(msg.sender, minter);
        }
        _safeMint(to, tokenID, false, data);
    }
}
