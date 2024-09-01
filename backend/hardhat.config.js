require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
// THIS IS JUST A DEMO PVT KEY USE YOUR OWN HERE >>>
const YOUR_PRIVATE_KEY = "YOUR_PVT_KEY";

module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [`0x${YOUR_PRIVATE_KEY}`],
    },
  },
};
