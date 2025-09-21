// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameTypes.sol";

interface UsingGameEvents is UsingGameTypes {
    /// @notice An avatar has been deposited, ready to enter
    /// @param avatarID the id of the NFT being deposited
    /// @param owner the account authorized to get the avatar back
    /// @param controller the account authorized to control the avatar in-game
    event AvatarDeposited(
        uint256 indexed avatarID,
        address indexed owner,
        address controller
    );

    /// @notice A avatar has been withdrawn
    /// @param avatarID the id of the NFT being transfered out
    event AvatarWithdrawn(uint256 indexed avatarID);

    /// @notice A avatar has entered the game
    /// @param avatarID the id of the NFT being added
    /// @param epoch the epoch at which it happened
    /// @param zone the resulting avatar's zone
    /// @param newPosition the resulting avatar's position
    event EnteredTheGame(
        uint256 indexed avatarID,
        uint64 indexed epoch,
        uint64 indexed zone,
        uint64 newPosition
    );

    /// @notice An avatar has left the game
    /// @param avatarID the id of the NFT being removed
    /// @param epoch the epoch at which it happened
    /// @param zoneWhenLeaving the avatar's zone when leaving
    /// @param positionWhenLeaving the avatar's position when leaving
    event LeftTheGame(
        uint256 indexed avatarID,
        uint64 indexed epoch,
        uint64 indexed zoneWhenLeaving,
        uint64 positionWhenLeaving
    );

    /// @notice A player has commited to make a move and reveal it on the reveal phase
    /// @param avatarID avatar whose commitment is made
    /// @param epoch epoch number on which this commit belongs to
    /// @param commitmentHash the hash of moves
    event CommitmentMade(
        uint256 indexed avatarID,
        uint64 indexed epoch,
        bytes24 commitmentHash
    );

    /// @notice A player has cancelled its current commitment (before it reached the reveal phase)
    /// @param avatarID avatar whose commitment is cancelled
    /// @param epoch epoch number on which this commit belongs to
    event CommitmentCancelled(uint256 indexed avatarID, uint64 indexed epoch);

    /// @notice A player has acknowledged its failure to reveal its previous commitment
    /// @param avatarID the account that made the commitment
    /// @param epoch epoch number on which this commit belongs to
    event CommitmentVoid(uint256 indexed avatarID, uint64 indexed epoch);

    /// @notice Player has revealed its previous commitment
    /// @param avatarID avatar id whose action is commited
    /// @param epoch epoch number on which this commit belongs to
    /// @param commitmentHash the hash of the moves
    /// @param actions the actions
    event CommitmentRevealed(
        uint256 indexed avatarID,
        uint64 indexed epoch,
        uint64 indexed zone,
        bytes24 commitmentHash,
        Action[] actions
    );

    // DEBUG
    event PreviousCommitmentNotRevealedEvent(
        uint256 indexed avatarID,
        uint64 epoch,
        bytes24 commitmentHash
    );
}
