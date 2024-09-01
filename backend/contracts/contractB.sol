// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ContractB is Initializable, AccessControlEnumerableUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");

    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed admin);
    event AdminRoleTransferred(address indexed oldAdmin, address indexed newAdmin);

    function initialize(address superAdmin) public virtual initializer {
        __AccessControlEnumerable_init(); // Initialize AccessControlEnumerable
        _grantRole(DEFAULT_ADMIN_ROLE, superAdmin);
        _grantRole(SUPER_ADMIN_ROLE, superAdmin);
    }

    function addAdmin(address signer, address newAdmin) public {
        require(hasRole(SUPER_ADMIN_ROLE, signer), "Caller is not a super admin");
        grantRole(ADMIN_ROLE, newAdmin);
        emit AdminAdded(newAdmin);
    }

    function removeAdmin(address signer, address admin) public {
        require(hasRole(SUPER_ADMIN_ROLE, signer), "Caller is not a super admin");
        revokeRole(ADMIN_ROLE, admin);
        emit AdminRemoved(admin);
    }

    function transferAdminRole(address signer, address oldAdmin, address newAdmin) public {
        require(hasRole(SUPER_ADMIN_ROLE, signer), "Caller is not a super admin");
        require(hasRole(ADMIN_ROLE, oldAdmin), "Old admin is not an admin");
        revokeRole(ADMIN_ROLE, oldAdmin);
        grantRole(ADMIN_ROLE, newAdmin);
        emit AdminRoleTransferred(oldAdmin, newAdmin);
    }

    function renounceAdminRole(address signer) public {
        require(hasRole(ADMIN_ROLE, signer), "Caller is not an admin");
        renounceRole(ADMIN_ROLE, signer);
    }

    function getAdmins() public view returns (address[] memory) {
        uint256 adminCount = getRoleMemberCount(ADMIN_ROLE);
        address[] memory admins = new address[](adminCount);
        for (uint256 i = 0; i < adminCount; i++) {
            admins[i] = getRoleMember(ADMIN_ROLE, i);
        }
        return admins;
    }

    
}
