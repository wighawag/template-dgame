// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./UsingGameTypes.sol";

interface IGameCommit is UsingGameTypes {
    function commit(uint256 avatarID, bytes24 commitmentHash, address payable payee) external payable;

    function cancelCommit(uint256 avatarID) external;
}

interface IGameReveal is UsingGameTypes {
    function reveal(
        uint256 avatarID,
        Action[] calldata actions,
        bytes32 secret,
        address payable payee
    ) external payable;

    function acknowledgeMissedReveal(uint256 avatarID) external;
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
