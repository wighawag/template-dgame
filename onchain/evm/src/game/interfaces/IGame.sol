// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameTypes.sol";

interface IGameCommit is UsingGameTypes {
    function makeCommitments(CommitmentSubmission[] calldata commitments, address payable payee) external payable;

    function cancelCommitments(uint256[] calldata avatarIDs) external;
}

interface IGameReveal is UsingGameTypes {
    function reveal(AvatarMove[] calldata moves, address payable payee) external payable;

    function acknowledgeMissedReveals(uint256[] memory avatarIDs) external;
}

interface IGameGetters is UsingGameTypes {
    function getCharactersInZone() external view;

    function getAvatar(uint256 avatarID) external view returns (AvatarResolved memory);

    function getCommitment(uint256 avatarID) external view returns (Commitment memory commitment);

    function getConfig() external view returns (Config memory config);
}

interface IGameEnter is UsingGameTypes {}

interface IGameLeave is UsingGameTypes {}

interface IGame is IGameCommit, IGameReveal, IGameGetters, IGameEnter, IGameLeave {}
