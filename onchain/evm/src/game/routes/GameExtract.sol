// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameExtract is IGameExtract, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function extract(uint256 avatarID, address to) external {
        _extract(msg.sender, avatarID, to);
    }
}
