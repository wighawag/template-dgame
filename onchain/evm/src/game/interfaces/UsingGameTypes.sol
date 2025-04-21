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
        Move,
        Use
    }

    /// @notice Move struct that define the action, type and position
    struct Action {
        ActionType actionType;
        uint128 data;
    }

    struct AvatarResolved {
        uint256 avatarID;
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
        uint64 startEpoch;
        uint64 position;
        uint64 zoneIndex;
    }

    struct Zone {
        uint256[] avatars;
    }

    struct Commitment {
        bytes24 hash;
        uint64 epoch;
    }
    // ------------------------------------------------------------------------
}
