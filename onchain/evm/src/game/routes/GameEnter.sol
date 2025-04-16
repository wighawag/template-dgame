// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../internal/UsingGameInternal.sol";
import "../interfaces/IGame.sol";

contract GameEnter is IGameEnter, UsingGameInternal {
    constructor(Config memory config) UsingGameInternal(config) {}
}
