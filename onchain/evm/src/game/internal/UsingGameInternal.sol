// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameStore.sol";
import "../interfaces/UsingGameEvents.sol";
import "../interfaces/UsingGameErrors.sol";
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

    function _resolveActions(uint256 avatarID, uint64 epoch, Action[] memory actions) internal {
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
        // TODO
        valid = true;
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

    function _checkHash(bytes24 commitmentHash, AvatarMove memory move) internal pure {
        bytes24 computedHash = bytes24(keccak256(abi.encode(move.secret, move.actions)));
        if (commitmentHash != computedHash) {
            revert CommitmentHashNotMatching();
        }
    }

    // function _collectTransfer(
    //     TokenTransferCollection memory transferCollection,
    //     TokenTransfer memory newTransfer
    // ) internal pure {
    //     // we look for the newTransfer address in case it is already present
    //     for (uint256 k = 0; k < transferCollection.numTransfers; k++) {
    //         if (transferCollection.transfers[k].to == newTransfer.to) {
    //             // if we found we add the amount
    //             transferCollection.transfers[k].amount += newTransfer.amount;
    //             return;
    //         }
    //     }
    //     // if we did not find that address we add it to the end
    //     transferCollection.transfers[transferCollection.numTransfers].to = newTransfer.to;
    //     transferCollection.transfers[transferCollection.numTransfers].amount = newTransfer.amount;
    //     // and increase the size to lookup for next time
    //     transferCollection.numTransfers++;
    // }

    // function _multiTransfer(IERC20WithIERC2612 token, TokenTransferCollection memory transferCollection) internal {
    //     for (uint256 i = 0; i < transferCollection.numTransfers; i++) {
    //         token.transfer(transferCollection.transfers[i].to, transferCollection.transfers[i].amount);
    //     }
    // }
}
