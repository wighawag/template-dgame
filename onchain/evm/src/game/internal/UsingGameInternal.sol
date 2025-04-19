// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameStore.sol";
import "../interfaces/UsingGameEvents.sol";
import "../interfaces/UsingGameErrors.sol";
import "../../utils/PositionUtils.sol";

abstract contract UsingGameInternal is UsingGameStore, UsingGameEvents, UsingGameErrors {
    constructor(Config memory config) UsingGameStore(config) {}

    //-------------------------------------------------------------------------
    // ENTRY POINTS
    //-------------------------------------------------------------------------
    function _enter(address controller, uint256 avatarID) internal {
        (uint24 epoch, ) = _epoch();

        _avatarControllers[avatarID][controller] = ControllerType.Basic;
        _avatars[avatarID].startEpoch = epoch + 1;
        uint64 position = 0; // TODO allow enter at other position
        _avatars[avatarID].position = position;
        uint64 zone = PositionUtils.getZone(position);
        _addToZone(zone, avatarID);
        emit EnteredTheGame(avatarID, epoch, zone, controller, position);
    }

    function _extract(address controller, uint256 avatarID, address to) internal {
        if (_avatarControllers[avatarID][controller] == UsingGameTypes.ControllerType.Owner) {
            revert UsingGameErrors.NotAuthorizedController(controller);
        }

        if (_avatars[avatarID].startEpoch != 0) {
            revert UsingGameErrors.AvatarStillInGame(avatarID);
        }
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

        bytes24 hashRevealed = commitment.hash;
        _checkHash(hashRevealed, actions, secret);

        uint64 newPosition = _resolveActions(avatarID, epoch, actions);

        emit CommitmentRevealed(avatarID, epoch, PositionUtils.getZone(newPosition), hashRevealed, actions);

        commitment.epoch = 0; // used
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

    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // INTERNALS
    //-------------------------------------------------------------------------

    function _resolveActions(
        uint256 avatarID,
        uint64 epoch,
        Action[] memory actions
    ) internal returns (uint64 newPosition) {
        Avatar memory avatar = _getAvatar(avatarID);
        uint64 initialPosition = avatar.position;
        (int32 x, int32 y) = PositionUtils.toXY(initialPosition);
        uint64 initialZone = PositionUtils.getZone(x, y);
        bool left = false;
        for (uint256 i = 0; i < actions.length; i++) {
            Action memory action = actions[i];

            // NWSE (North, West, South, East)
            if (action.actionType == ActionType.Move) {
                if (action.data == 1) {
                    // North
                    y -= 1;
                } else if (action.data == 2) {
                    // West
                    x -= 1;
                } else if (action.data == 3) {
                    // South
                    y += 1;
                } else if (action.data == 4) {
                    // East
                    x += 1;
                }
            } else if (action.actionType == ActionType.Use) {
                // TODO use cell action
                // for now consider it an Exit
                left = true;
                break; // We ignore any further actions
            }
        }

        newPosition = PositionUtils.fromXY(x, y);
        if (left) {
            _avatars[avatarID].startEpoch = 0;
            _avatars[avatarID].position = 0;
            _removeFromZone(initialZone, avatarID);
            emit LeftTheGame(avatarID, epoch, PositionUtils.getZone(x, y), newPosition);
        } else {
            uint64 newZone = PositionUtils.getZone(x, y);
            if (initialZone != newZone) {
                _removeFromZone(initialZone, avatarID);
                _addToZone(newZone, avatarID);
            }
            _avatars[avatarID].position = newPosition;
        }
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

    function _getAvatarsInZone(
        uint64 zone,
        uint64 fromIndex,
        uint64 limit
    ) internal view returns (AvatarResolved[] memory avatars, bool more) {
        uint256 numAvatarsInZone = _zones[zone].avatars.length;
        if (fromIndex < numAvatarsInZone) {
            if (fromIndex + limit > numAvatarsInZone) {
                limit = uint64(numAvatarsInZone - fromIndex);
                more = false;
            } else {
                more = true;
            }
            avatars = new AvatarResolved[](limit);
            for (uint256 i = 0; i < limit; i++) {
                avatars[i] = _getResolvedAvatar(_zones[zone].avatars[fromIndex + i]);
            }
        }
    }

    function _checkHash(bytes24 commitmentHash, Action[] memory actions, bytes32 secret) internal pure {
        bytes24 computedHash = bytes24(keccak256(abi.encode(secret, actions)));
        if (commitmentHash != computedHash) {
            revert CommitmentHashNotMatching();
        }
    }

    function _removeFromZone(uint64 zone, uint256 avatarID) internal {
        uint256 numAvatarsInZone = _zones[zone].avatars.length;
        if (numAvatarsInZone == 1) {
            _zones[zone].avatars.pop();
        } else {
            uint64 index = _avatars[avatarID].zoneIndex;
            if (index == numAvatarsInZone - 1) {
                _zones[zone].avatars.pop();
            } else {
                uint256 lastAvatarID = _zones[zone].avatars[numAvatarsInZone - 1];
                _avatars[lastAvatarID].zoneIndex = index;
                _zones[zone].avatars[index] = lastAvatarID;
                _zones[zone].avatars.pop();
            }
        }
    }

    function _addToZone(uint64 zone, uint256 avatarID) internal {
        _avatars[avatarID].zoneIndex = uint64(_zones[zone].avatars.length);
        _zones[zone].avatars.push(avatarID);
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
    //-------------------------------------------------------------------------
}
