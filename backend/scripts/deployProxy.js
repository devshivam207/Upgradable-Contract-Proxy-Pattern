const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // // Deploy ContractB
  // const ContractB = await ethers.getContractFactory("ContractB");
  // console.log("Deploying ContractB...");
  // const contractB = await upgrades.deployProxy(ContractB, [deployer.address], {
  //   initializer: "initialize",
  // });

  // console.log("ContractB deployed to:", contractB.target);

  // Deploy ContractA
  const ContractA = await ethers.getContractFactory("ContractA");
  console.log("Deploying ContractA...");
  const contractA = await upgrades.deployProxy(ContractA, [], {
    initializer: "initialize",
  });
  console.log("ContractA deployed to:", contractA.target);

  // Set up ContractA to use ContractB
  // Note: Since ContractA depends on ContractB, ensure that ContractB is initialized and address is set correctly.
  console.log("Setup complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
