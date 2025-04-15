// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameGetters is IGameGetters, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function getCharactersInZone() external view {}

    function getAvatar(uint256 avatarID) external view returns (AvatarResolved memory) {
        return _getResolvedAvatar(avatarID);
    }

    function getCommitment(uint256 avatarID) external view returns (Commitment memory commitment) {
        return _commitments[avatarID];
    }

    function getConfig() external view returns (Config memory config) {
        config.startTime = START_TIME;
        config.commitPhaseDuration = COMMIT_PHASE_DURATION;
        config.revealPhaseDuration = REVEAL_PHASE_DURATION;
        config.time = TIME;
    }
}
