// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameStore.sol";
import "../interface/UsingGameEvents.sol";
import "../interface/UsingGameErrors.sol";
import "../../utils/PositionUtils.sol";

abstract contract UsingGameInternal is UsingGameStore, UsingGameEvents, UsingGameErrors {
    using PositionUtils for uint64;

    constructor(Config memory config) UsingGameStore(config) {}

    function _makeCommitment(uint256 avatarID, bytes24 commitmentHash) internal {
        // AvatarResolved memory avatar = _getResolvedAvatar(avatarID);

        // if (avatar.dead) {
        //     revert AvatarIsDead(avatarID);
        // }

        Commitment storage commitment = _commitments[avatarID];

        (uint24 epoch, bool commiting) = _epoch();

        if (!commiting) {
            revert InRevealPhase();
        }
        if (commitment.epoch != 0 && commitment.epoch != epoch) {
            revert PreviousCommitmentNotRevealed();
        }

        commitment.hash = commitmentHash;
        commitment.epoch = epoch;

        emit CommitmentMade(avatarID, epoch, commitmentHash);
    }

    // function _isValidMove(uint64 from, uint64 to) internal pure returns (bool valid) {
    //     // TODO
    //     valid = true;
    // }

    function _epoch() internal view virtual returns (uint24 epoch, bool commiting) {
        uint256 epochDuration = COMMIT_PHASE_DURATION + REVEAL_PHASE_DURATION;
        uint256 time = _timestamp();
        if (time < START_TIME) {
            revert GameNotStarted();
        }
        uint256 timePassed = time - START_TIME;
        epoch = uint24(timePassed / epochDuration + 2); // epoch start at 2, this make the hypothetical previous reveal phase's epoch to be 1
        commiting = timePassed - ((epoch - 2) * epochDuration) < COMMIT_PHASE_DURATION;
    }

    function _getResolvedAvatar(uint256 avatarID) internal view returns (AvatarResolved memory) {
        Avatar memory avatar = _avatars[avatarID];

        return AvatarResolved({position: avatar.position});
    }

    function _getAvatar(uint256 avatarID) internal view returns (Avatar memory) {
        return _avatars[avatarID];
    }
}
