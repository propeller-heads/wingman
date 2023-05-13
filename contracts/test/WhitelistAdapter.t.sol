// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/WhitelistAdapter.sol";

contract WhitelistAdapterTest is Test {
    WhitelistAdapter public whitelist;
    address constant bob = 0x9a8a35259E3FeF9CCB0D32CFCCF3C264Da7aCd4E;
    address constant realResolver = 0xd7f6F541D4210550ca56f7b4C4A549EFD4CAFb49;

    function setUp() public {
        whitelist = new WhitelistAdapter(0xcb8308fcB7BC2f84ed1bEa2C016991D34de5cc77);
        whitelist.addMember(bob);
    }

    function testIsResolver() public {
        assertTrue(whitelist.isResolver(bob));
        assertTrue(whitelist.isResolver(realResolver));
    }
}
