// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameGetters is IGameGetters, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function getAvatarsInZone(
        uint64 zone,
        uint64 fromIndex,
        uint64 limit
    ) external view returns (AvatarResolved[] memory avatars, bool more) {
        return _getAvatarsInZone(zone, fromIndex, limit);
    }

    function getAvatar(uint256 avatarID) external view returns (AvatarResolved memory) {
        return _getResolvedAvatar(avatarID);
    }

    function getCommitment(uint256 avatarID) external view returns (Commitment memory commitment) {
        return _commitments[avatarID];
    }

    function getConfig() external view returns (Config memory config) {
        return
            Config({
                startTime: START_TIME,
                commitPhaseDuration: COMMIT_PHASE_DURATION,
                revealPhaseDuration: REVEAL_PHASE_DURATION,
                avatars: AVATARS,
                time: TIME
            });
    }
}
