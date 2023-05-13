// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface WhitelistRegistry {
    function getWhitelist() external view returns (address[] memory);
}

contract WhitelistAdapter {
    mapping(address => bool) private internalWhitelist;
    WhitelistRegistry registry;

    constructor(address registryAddress) {
        registry = WhitelistRegistry(registryAddress);
    }

    function addMember(address newMember) external {
        internalWhitelist[newMember] = true;
    }

    function isWhitelisted(address user) external view returns (bool) {
        if (internalWhitelist[user] == true) {
            return true;
        }
        return false;
    }

    function isResolver(address resolver) external view returns (bool) {
        // Allows us to mock this call
        if (this.isWhitelisted(resolver) == true) {
            return true;
        }
        address[] memory members = registry.getWhitelist();
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == resolver) {
                return true;
            }
        }
        return false;
    }
}
