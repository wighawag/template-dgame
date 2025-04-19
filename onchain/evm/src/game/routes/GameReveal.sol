// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameReveal is IGameReveal, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function reveal(AvatarMove[] calldata moves, address payable payee) external payable {
        _reveal(moves);

        if (payee != address(0)) {
            payee.transfer(msg.value);
        }
    }

    function acknowledgeMissedReveal(uint256 avatarID) external {
        _acknowledgeMissedReveal(avatarID);
    }
}
