// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solidity-kit/solc_0_8/debug/time/interfaces/ITime.sol";

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

    struct AvatarResolved {
        uint64 position;
    }

    /// @notice Commitment Submission data, avatar and hash
    struct CommitmentSubmission {
        uint256 avatarID;
        bytes24 hash;
    }

    /// @notice Config struct to configure the game instance
    struct Config {
        uint256 startTime;
        uint256 commitPhaseDuration;
        uint256 revealPhaseDuration;
        ITime time;
    }
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // STORAGE TYPES
    // ------------------------------------------------------------------------

    struct Avatar {
        uint64 position;
    }

    struct Commitment {
        bytes24 hash;
        uint64 epoch;
    }
    // ------------------------------------------------------------------------
}
