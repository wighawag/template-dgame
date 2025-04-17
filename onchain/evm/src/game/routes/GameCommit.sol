// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameCommit is IGameCommit, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    function makeCommitments(CommitmentSubmission[] calldata commitments, address payable payee) external payable {
        for (uint256 i = 0; i < commitments.length; i++) {
            _makeCommitment(commitments[i].avatarID, commitments[i].hash);
        }

        if (payee != address(0)) {
            payee.transfer(msg.value);
        }
    }

    function cancelCommitments(uint256[] calldata avatarIDs) external {
        for (uint256 i = 0; i < avatarIDs.length; i++) {
            uint256 avatarID = avatarIDs[i];

            if (!_avatars[avatarID].inside) {
                revert AvatarNotInGame(avatarID);
            }

            // TODO check msg.sender control of avatarID
            Commitment storage commitment = _commitments[avatarID];
            (uint24 epoch, bool commiting) = _epoch();
            if (!commiting) {
                revert InRevealPhase();
            }
            if (commitment.epoch != epoch) {
                revert PreviousCommitmentNotRevealed();
            }

            // Note that we do not reset the hash
            // This ensure the slot do not get reset and keep the gas cost consistent across execution
            commitment.epoch = 0;

            emit CommitmentCancelled(avatarID, epoch);
        }
    }
}
