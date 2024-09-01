const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Upgrading contracts with the account:", deployer.address);

  // Address of the existing ContractA proxy
  const contractAProxyAddress = "0x567ca647b6083b9e0db365658f3Ec810087B7D6a";

  // Deploying the new implementation contract
  const UpgradedContractA = await ethers.getContractFactory(
    "UpgradedContractA"
  );
  console.log("Upgrading ContractA...");

  try {
    const upgraded = await upgrades.upgradeProxy(
      contractAProxyAddress,
      UpgradedContractA
    );
    console.log("Upgraded ContractA deployed to:", await upgraded.getAddress());
    console.log("Upgrade complete.");

    // Verify roles
    const SUPER_ADMIN_ROLE = ethers.keccak256(
      ethers.toUtf8Bytes("SUPER_ADMIN_ROLE")
    );
    const isSuperAdmin = await upgraded.hasRole(
      SUPER_ADMIN_ROLE,
      deployer.address
    );
    console.log("Is deployer Super Admin?", isSuperAdmin);
  } catch (error) {
    console.error("Upgrade failed:", error.message);
    if (error.data) {
      const UpgradedContractA = await ethers.getContractFactory(
        "UpgradedContractA"
      );
      const decodedError = UpgradedContractA.interface.parseError(error.data);
      console.error("Decoded error:", decodedError);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
