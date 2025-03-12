// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ProxyAdmin as OpenZeppelinProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy as OpenZeppelinTransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract TransparentUpgradeableProxy is
    OpenZeppelinTransparentUpgradeableProxy
{
    constructor(
        address _logic,
        address initialOwner,
        bytes memory _data
    )
        payable
        OpenZeppelinTransparentUpgradeableProxy(_logic, initialOwner, _data)
    {}
}

contract ProxyAdmin is OpenZeppelinProxyAdmin {
    constructor(address initialOwner) OpenZeppelinProxyAdmin(initialOwner) {}
}
