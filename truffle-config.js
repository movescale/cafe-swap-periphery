const HDWalletProvider = require('truffle-hdwallet-provider');

privateKeys= 'b871381fc3b6c3c2af0ee4ded3a2414c984e90d6a5133a6b48d75fcc13c0a814';

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    bsctest: {
      provider: () => new HDWalletProvider(privateKeys, `https://data-seed-prebsc-2-s1.binance.org:8545/`),
      network_id: 97,
      networkCheckTimeout:10000000,
      confirmations: 2,
      timeoutBlocks: 2000,
      from: "0xfd6f5A60D2D8b12039F906D112f10Fb66F881087",
      skipDryRun: true
    }
  },  
  compilers: {
    solc: {
      version: "0.6.6"
    }
  }
};
