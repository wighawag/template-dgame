// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameLeave is IGameLeave, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function leave(uint256 avatarID, address to) external {
        _leave(msg.sender, avatarID, to);
    }
}
