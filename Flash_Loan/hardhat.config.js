require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");  // waffle is old 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.5.5" },
      { version: "0.6.6" },
      { version: "0.8.8" },
    ],
  },
  networks: {
    hardhat: {
      forking: {   // we are not working on bsc Mainnet chain we are working on forked bsc Mainnet chain
               //Public RPC Nodes
        url: "https://bsc-mainnet.infura.io/v3/ffd685538dee4ee3bca98e5b475fb524", // forking == local copy of actual binance chain in PC  (binance RPC)   -> https://docs.bscscan.com/misc-tools-and-utilities/public-rpc-nodes
    },
    },
  },
};