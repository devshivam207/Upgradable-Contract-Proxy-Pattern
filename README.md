# Solidity + Web3 Assessment Project

This project demonstrates a full-stack dapp with upgradeable smart contracts and a React frontend. It includes implementation of the EIP 2535 Diamond pattern for contract upgrades, admin access control, and a web interface for interacting with the contracts.

## Project Structure

```
project-root/
├── frontend/
│   └── (React app files)
├── backend/
│   ├── contracts/
│   │   ├── ContractA.sol
│   │   ├── ContractB.sol
│   │   └── UpgradableA.sol
│   └── (Hardhat configuration and scripts)
└── README.md
```

## Smart Contracts

### ContractA.sol
- Implements a getter and setter function for a uint variable
- Includes reentrancy guard and admin access control
- Deployed as an upgradeable proxy on Binance Smart Chain Testnet

### ContractB.sol
- Serves as an access registry for ContractA
- Implements addAdmin, removeAdmin, transferAdminRole, and renounceAdminRole functions
- Has a superAdmin role

### UpgradableA.sol
- Inherits from ContractB
- Represents the upgraded version of ContractA

## Frontend

The frontend is a React application that provides a user interface for interacting with the smart contracts. It includes:
- Interface for calling getter and setter functions
- Functionality for contract upgradeability

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Configure Hardhat for Binance Smart Chain Testnet in `backend/hardhat.config.js`
4. Deploy contracts:
   ```
   cd backend
   npx hardhat run scripts/deploy.js --network bscTestnet
   ```
5. Update contract addresses in the frontend
6. Start the frontend:
   ```
   cd ../frontend
   npm start
   ```

## Usage

1. Automatically detect wallet conected or not.
2. Use the interface to interact with the smart contracts:
   - Call the getter function
   - Use the setter function with input
   - Upgrade the contract
3. Admin functions:
   - Add/remove admins
   - Transfer admin roles
   - Renounce admin role

## Testing

1. Initial state: Getter function returns 0
2. Set value to 10: Setter function input 10
3. Verify: Getter function returns 10
4. Upgrade ContractA to inherit from ContractB
5. Change admin address using the access registry
6. Verify new admin address
7. Set value to 81: Setter function input 81
8. Verify: Getter function returns 91 (10 + 81)

## License

[MIT License](https://opensource.org/licenses/MIT)
