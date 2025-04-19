// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameStore.sol";
import "../interfaces/UsingGameEvents.sol";
import "../interfaces/UsingGameErrors.sol";
import "../../utils/PositionUtils.sol";

abstract contract UsingGameInternal is UsingGameStore, UsingGameEvents, UsingGameErrors {
    constructor(Config memory config) UsingGameStore(config) {}

    function _enter(address controller, uint256 avatarID) internal {
        (uint24 epoch, ) = _epoch();

        _avatarControllers[avatarID][controller] = ControllerType.Basic;
        _avatars[avatarID].startEpoch = epoch + 1;
        uint64 position = 0; // TODO allow enter at other position
        _avatars[avatarID].position = position;
        emit EnteredTheGame(avatarID, controller, position);
    }

    function _leave(address controller, uint256 avatarID, address to) internal {
        if (_avatarControllers[avatarID][controller] == UsingGameTypes.ControllerType.None) {
            revert UsingGameErrors.NotAuthorizedController(controller);
        }
        uint64 lastPosition = _avatars[avatarID].position;

        _avatars[avatarID].position = 0;
        _avatars[avatarID].startEpoch = 0;
        emit LeftTheGame(avatarID, controller, lastPosition);

        // transfer Character back to the player
        AVATARS.safeTransferFrom(address(this), to, avatarID);
    }

    function _makeCommitment(address controller, uint256 avatarID, bytes24 commitmentHash) internal {
        if (_avatarControllers[avatarID][controller] == UsingGameTypes.ControllerType.None) {
            revert UsingGameErrors.NotAuthorizedController(controller);
        }

        (uint24 epoch, bool commiting) = _epoch();

        if (!commiting) {
            revert InRevealPhase();
        }

        // AvatarResolved memory avatar = _getResolvedAvatar(avatarID);

        // if (avatar.dead) {
        //     revert AvatarIsDead(avatarID);
        // }

        if (_avatars[avatarID].startEpoch > epoch) {
            revert AvatarNotReady(avatarID);
        }

        Commitment storage commitment = _commitments[avatarID];

        if (commitment.epoch != 0 && commitment.epoch != epoch) {
            revert PreviousCommitmentNotRevealed();
        }

        commitment.hash = commitmentHash;
        commitment.epoch = epoch;

        emit CommitmentMade(avatarID, epoch, commitmentHash);
    }

    function _cancelCommitment(address controller, uint256 avatarID) internal {
        if (_avatarControllers[avatarID][controller] == UsingGameTypes.ControllerType.None) {
            revert UsingGameErrors.NotAuthorizedController(controller);
        }

        if (_avatars[avatarID].startEpoch == 0) {
            revert AvatarNotInGame(avatarID);
        }

        (uint24 epoch, bool commiting) = _epoch();
        if (!commiting) {
            revert InRevealPhase();
        }

        Commitment storage commitment = _commitments[avatarID];
        if (commitment.epoch == 0) {
            revert NoCommitmentToCancel();
        }

        if (commitment.epoch != epoch) {
            revert PreviousCommitmentNotRevealed();
        }

        // Note that we do not reset the hash
        // This ensure the slot do not get reset and keep the gas cost consistent across execution
        commitment.epoch = 0;

        emit CommitmentCancelled(avatarID, epoch);
    }

    function _reveal(uint256 avatarID, Action[] calldata actions, bytes32 secret) internal {
        (uint24 epoch, bool commiting) = _epoch();
        if (commiting) {
            revert InCommitmentPhase();
        }
        Commitment storage commitment = _commitments[avatarID];

        if (commitment.epoch == 0) {
            revert NothingToReveal();
        }
        if (commitment.epoch != epoch) {
            revert InvalidEpoch();
        }
        _checkHash(commitment.hash, actions, secret);
        _resolveActions(avatarID, actions);

        bytes24 hashRevealed = commitment.hash;
        commitment.epoch = 0; // used

        emit CommitmentRevealed(avatarID, epoch, hashRevealed, actions);
    }

    function _acknowledgeMissedReveal(uint256 avatarID) internal {
        // TODO burn / stake ....
        Commitment storage commitment = _commitments[avatarID];
        (uint24 epoch, ) = _epoch();

        if (commitment.epoch == 0) {
            revert NothingToReveal();
        }

        if (commitment.epoch == epoch) {
            revert CanStillReveal();
        }

        commitment.epoch = 0;

        // TODO block nft control

        // here we cannot know whether there were further move or even any moves
        // we just burn all tokens in reserve
        emit CommitmentVoid(avatarID, epoch);
    }

    function _resolveActions(uint256 avatarID, Action[] memory actions) internal {
        Avatar memory avatar = _getAvatar(avatarID);
        uint64 position = avatar.position;
        for (uint256 i = 0; i < actions.length; i++) {
            uint64[] memory path = actions[i].path;
            for (uint256 j = 0; j < path.length; j++) {
                uint64 next = path[j];
                if (_isValidMove(position, next)) {
                    position = next;
                }
            }
        }
        _avatars[avatarID].position = position;
    }

    function _isValidMove(uint64 from, uint64 to) internal pure returns (bool valid) {
        (int32 x1, int32 y1) = PositionUtils.toXY(from);
        (int32 x2, int32 y2) = PositionUtils.toXY(to);

        if (x1 == x2 && y1 == y2 + 1) {
            return true;
        }
        if (x1 == x2 && y1 == y2 - 1) {
            return true;
        }
        if (x1 == x2 + 1 && y1 == y2) {
            return true;
        }
        if (x1 == x2 - 1 && y1 == y2) {
            return true;
        }
        return false;
    }

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

    //-------------------------------------------------------------------------
    // UTILS
    //-------------------------------------------------------------------------

    function _checkHash(bytes24 commitmentHash, Action[] memory actions, bytes32 secret) internal pure {
        bytes24 computedHash = bytes24(keccak256(abi.encode(secret, actions)));
        if (commitmentHash != computedHash) {
            revert CommitmentHashNotMatching();
        }
    }
}
