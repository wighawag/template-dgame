// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameTypes.sol";

interface UsingGameErrors is UsingGameTypes {
    /// @notice Game has not started yet, can't perform any action
    error GameNotStarted();

    /// @notice happen when an unauthorized account attempt to control an avatar
    error NotAuthorizedController(address sender);

    /// @notice happen when attempting to leave the game from a non-exit position
    error UnableToExitFromThisPosition(uint64 position);

    /// @notice happen when attempting to move an avatar not in the game
    error AvatarNotInGame(uint256 avatarID);

    /// @notice When in Reveal phase, it is not possible to commit new moves or cancel previous commitment
    ///  During Reveal phase, players have to reveal their commitment, if not already done.
    error InRevealPhase();

    /// @notice When in Commit phase, player can make new commitment but they cannot reveal their move yet.
    error InCommitmentPhase();

    /// @notice Previous commitment need to be revealed before making a new one. Even if the corresponding reveal phase has passed.\
    ///  It is also not possible to withdraw any amount from reserve until the commitment is revealed.\
    /// @notice If player lost the information to reveal, it can acknowledge failure which will burn all its reserve.\
    error PreviousCommitmentNotRevealed();

    /// @notice Player have to reveal their commitment using the exact same move values
    ///  If they provide different value, the commitment hash will differ and Game will reject their reveal.
    error CommitmentHashNotMatching();

    /// @notice Player can only reveal moves they commited.
    error NothingToReveal();

    /// @notice Player can only reveal their move in the same epoch they commited.abi
    ///  If a player reveal later it can only do to minimize the reserve burn cost by calling : `acknowledgeMissedReveal`
    error InvalidEpoch();

    /// @notice Player have to reveal if they can
    /// prevent player from acknowledging missed reveal if there is still time to reveal.
    error CanStillReveal();

    /// @notice Player have to reveal if they can
    /// @param avatarID the id of the dead avatar
    /// The avatar is dead, no action possible
    error AvatarIsDead(uint256 avatarID);

    /// @notice The cell configuration is invalid
    /// This can happen win debug mode where admin can setup cell bypassing moves rules
    /// For example when setting up neighborood configuration that would require a cell to have negative life
    error ImpossibleConfiguration();

    error OnlyAvatarsAreAccepted();
}
