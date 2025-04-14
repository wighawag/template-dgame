// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "../interface/UsingGameTypes.sol";

abstract contract UsingVirtualTime {
    // TODO use hardhat-preprocessor

    ITime immutable TIME;

    constructor(UsingGameTypes.Config memory config) {
        TIME = config.time;
    }

    function _timestamp() internal view returns (uint256) {
        if (address(TIME) == address(0)) {
            return block.timestamp;
        }
        return TIME.timestamp();
    }
}
