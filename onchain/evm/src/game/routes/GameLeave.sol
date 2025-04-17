// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameLeave is IGameLeave, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function leave(uint256 avatarID, address to) external {
        address controller = msg.sender;
        if (_avatarControllers[avatarID][controller] == UsingGameTypes.ControllerType.None) {
            revert UsingGameErrors.NotAuthorizedController(controller);
        }
        uint64 lastPosition = _avatars[avatarID].position;

        _avatars[avatarID].position = 0;
        _avatars[avatarID].inside = false;
        emit LeftTheGame(avatarID, controller, lastPosition);

        // transfer Character back to the player
        AVATARS.safeTransferFrom(address(this), to, avatarID);
    }
}
