// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/WhitelistAdapter.sol";

contract WhitelistAdapaterDeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOY_PK");
        vm.startBroadcast(deployerPrivateKey);

        new WhitelistAdapter(address(0));
    }
}
