// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solidity-kit/solc_0_8/debug/time/interfaces/ITime.sol";
import "solidity-kit/solc_0_8/ERC721/interfaces/IERC721.sol";

interface UsingGameTypes {
    // ------------------------------------------------------------------------
    // EXTERNAL TYPES
    // ------------------------------------------------------------------------

    /// @notice The set of possible action
    enum ActionType {
        None
    }

    /// @notice Move struct that define the action, type and position
    struct Action {
        uint64[] path; // we use position instead of delta so we can add teleport or other path mechanisms
        ActionType actionType;
    }

    /// @notice Move struct that define position and actions for one avatar
    struct AvatarMove {
        uint256 avatarID;
        Action[] actions;
        bytes32 secret;
    }

    struct AvatarResolved {
        uint64 position;
    }

    /// @notice Config struct to configure the game instance
    struct Config {
        uint256 startTime;
        uint256 commitPhaseDuration;
        uint256 revealPhaseDuration;
        ITime time;
        IERC721 avatars;
    }
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // STORAGE TYPES
    // ------------------------------------------------------------------------

    enum ControllerType {
        None,
        Basic,
        Owner
    }

    struct Avatar {
        bool inside;
        uint64 position;
    }

    struct Commitment {
        bytes24 hash;
        uint64 epoch;
    }
    // ------------------------------------------------------------------------
}
