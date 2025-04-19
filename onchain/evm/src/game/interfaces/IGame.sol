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
    function getAvatarsInZone(
        uint64 zone,
        uint64 fromIndex,
        uint64 limit
    ) external view returns (AvatarResolved[] memory avatars, bool more);

    function getAvatarsInMultipleZones(
        uint64[] calldata zones,
        uint64 fromIndex,
        uint64 limit
    ) external view returns (AvatarResolved[] memory avatars, bool more);

    function getAvatar(uint256 avatarID) external view returns (AvatarResolved memory avatar);

    function getCommitment(uint256 avatarID) external view returns (Commitment memory commitment);

    function getConfig() external view returns (Config memory config);
}

interface IGameEnter is UsingGameTypes {
    function enter(uint256 avatarID, address payable payee) external payable;
}

interface IGameExtract is UsingGameTypes {
    function extract(uint256 avatarID, address to) external;
}

interface IGame is IGameCommit, IGameReveal, IGameGetters, IGameEnter, IGameExtract {}
