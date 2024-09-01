// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "./contractB.sol";

contract UpgradedContractA is Initializable, ReentrancyGuardUpgradeable, ContractB {
    uint256 private value;

    event ValueSet(uint256 newValue);

    // Initializer function
    function initialize(address superAdmin) public override initializer {
    require(superAdmin != address(0), "Invalid superAdmin address");
    __ReentrancyGuard_init();
    ContractB.initialize(superAdmin);
}

    function setValue(uint256 _value, address _sender) public nonReentrant {
        require(hasRole(ADMIN_ROLE, _sender), "Caller is not an admin");
        value += _value;
        emit ValueSet(value);
    }

    function getValue() public view returns (uint256) {
        return value;
    }

    receive() external payable {}
}