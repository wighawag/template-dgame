// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./Sale.sol";
import "./Avatars.sol";

contract AvatarsSale is Sale {
    constructor(Avatars items, Config memory config) Sale(items, config) {}

    function _executeMint(address to, bytes calldata data) internal override returns (uint256 tokenID) {
        // TODO
    }
}
