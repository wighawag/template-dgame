// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";
import "solidity-kit/solc_0_8/ERC721/interfaces/IERC721Receiver.sol";

contract GameEnter is IGameEnter, UsingGameInternal, IERC721Receiver {
    constructor(Config memory config) UsingGameInternal(config) {}

    // TODO controller and owner
    function enter(uint256 avatarID, address payable payee) external payable {
        _enter(msg.sender, avatarID);

        // transfer Character to the game
        AVATARS.transferFrom(msg.sender, address(this), avatarID);

        // extra steps for which we do not intend to track via events
        if (payee != address(0) && msg.value != 0) {
            payee.transfer(msg.value);
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenID,
        bytes calldata
    ) external override returns (bytes4) {
        if (msg.sender == address(AVATARS)) {
            _enter(from == address(0) ? operator : from, tokenID);
        } else {
            revert OnlyAvatarsAreAccepted();
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}
