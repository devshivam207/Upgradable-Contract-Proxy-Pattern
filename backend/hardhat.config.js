require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

const YOUR_PRIVATE_KEY =
  "b36bfa799dccc4a3b4d53efce883e4ea5935364eb314fb0f80f07c907c39bf3b";

module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [`0x${YOUR_PRIVATE_KEY}`],
    },
  },
};
