// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ContractA is Initializable, ReentrancyGuardUpgradeable, AccessControlEnumerableUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");
    uint256 private value;

    event ValueSet(uint256 newValue);

    // Initializer function instead of constructor
    function initialize() public initializer {
        __ReentrancyGuard_init(); // Initialize ReentrancyGuard
        __AccessControlEnumerable_init(); // Initialize AccessControlEnumerable
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(SUPER_ADMIN_ROLE, msg.sender);
        value = 0;
    }

    function setValue(uint256 _value, address _sender) public nonReentrant {
        require(hasRole(ADMIN_ROLE, _sender), "Caller is not an admin");
        value += _value;
        emit ValueSet(value);
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}
