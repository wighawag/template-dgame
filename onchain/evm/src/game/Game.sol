// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./internal/UsingGameInternal.sol";

contract Game is UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}

    //-------------------------------------------------------------------------
    // COMMIT
    //-------------------------------------------------------------------------
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

    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // REVEAL
    //-------------------------------------------------------------------------
    function reveal(AvatarMove[] calldata moves, address payable payee) external payable {
        (uint24 epoch, bool commiting) = _epoch();
        if (commiting) {
            revert InCommitmentPhase();
        }

        for (uint256 i = 0; i < moves.length; i++) {
            AvatarMove memory move = moves[i];
            Commitment storage commitment = _commitments[move.avatarID];

            if (commitment.epoch == 0) {
                revert NothingToReveal();
            }
            if (commitment.epoch != epoch) {
                revert InvalidEpoch();
            }
            _checkHash(commitment.hash, move);
            _resolveActions(move.avatarID, epoch, move.actions);

            bytes24 hashRevealed = commitment.hash;
            commitment.epoch = 0; // used

            emit CommitmentRevealed(move.avatarID, epoch, hashRevealed, move.actions);
        }

        if (payee != address(0)) {
            payee.transfer(msg.value);
        }
    }

    function acknowledgeMissedReveals(uint256[] memory avatarIDs) external {
        for (uint256 i = 0; i < avatarIDs.length; i++) {
            uint256 avatarID = avatarIDs[i];
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
    }

    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // GETTERS
    //-------------------------------------------------------------------------

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
    //-------------------------------------------------------------------------
}
