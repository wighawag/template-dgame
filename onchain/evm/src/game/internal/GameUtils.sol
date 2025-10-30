// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "../interfaces/UsingGameTypes.sol";
import "../../utils/PositionUtils.sol";
import "../data/generated/Areas.sol";
import "hardhat/console.sol";

library GameUtils {
    function computeArea(
        bytes32 areaHash
    ) internal pure returns (UsingGameTypes.Area memory) {
        // "made only for 16x16"
        assert(PositionUtils.ZONE_SIZE == 16);
        return Areas.getArea(2); //Areas.getArea(uint256(areaHash) % 3); // 3 is number of different area
    }

    function areaAt(
        int32 x,
        int32 y
    ) internal pure returns (UsingGameTypes.Area memory area) {
        // TODO
        (int32 areaX, int32 areaY) = PositionUtils.zoneCoords(x, y);
        area = computeArea(keccak256(abi.encodePacked(areaX, areaY)));
    }

    function wallAt(
        UsingGameTypes.Area memory area,
        int32 x,
        int32 y
    ) internal pure returns (bool) {
        uint8 xx = PositionUtils.zoneLocalCoord(x);
        uint8 yy = PositionUtils.zoneLocalCoord(y);
        uint8 i = yy * uint8(int8(PositionUtils.ZONE_SIZE)) + xx;
        uint8 MID = uint8(
            int8((PositionUtils.ZONE_SIZE * PositionUtils.ZONE_SIZE) / 2)
        );
        if (i < MID) {
            uint256 cellType = ((area.firstBytes32 >> (254 - i * 2)) & 0x3);
            return cellType == 1 || cellType == 2;
        } else {
            uint256 cellType = ((area.secondBytes32 >> (254 - (i - MID) * 2)) &
                0x3);
            return cellType == 1 || cellType == 2;
        }
    }
}
