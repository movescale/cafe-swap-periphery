'use strict';
const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');

const CafeRouter02 = require('./build/CafeRouter02.json');
const WBNB = require('./buildV1/WBNB.json');

function get_data(_message) {
  return new Promise(function(resolve, reject) {
      fs.readFile('./installation_data.json', (err, data) => {
          if (err) throw err;
          resolve(data);
      });
  });
}

function write_data(_message) {
  return new Promise(function(resolve, reject) {
      fs.writeFile('./installation_data.json', _message, (err) => {
          if (err) throw err;
          console.log('Data written to file');
          resolve();
      });
  });
}

var privateKeys = [];
var URL = "";


(async () => {
  // Read in the configuration information
  var data = await get_data();
  var data_object = JSON.parse(data);
  // Add keys
  console.log("Adding Alice key ...");
  privateKeys.push(data_object.private_key.alice);
  // RPC
  URL = data_object.provider.rpc_endpoint;

  // Web3 - keys and accounts
  const Web3 = require("web3");
  const provider = new HDWalletProvider(privateKeys, URL, 0, 1);
  const web3 = new Web3(provider);
  await web3.eth.net.isListening();
  console.log('Web3 is connected.');
  console.log("Private keys: " + privateKeys);
  let accounts = await web3.eth.getAccounts();
  console.log(`accounts: ${JSON.stringify(accounts)}`);

  let wETH;
  wETH = await new web3.eth.Contract(WBNB.abi).deploy({
                            data: "0x" + WBNB.evm.bytecode.object
                          })
                          .send({
                            from: accounts[0]
                          })

  console.log(`\WBNB contract deployed at ${wETH.options.address}`);
  console.log(`Please store this wrapper OETH address for future use ^^^`);
  data_object.contract_address.woeth = wETH.options.address;

  let cafeRouter02;
  cafeRouter02 = await new web3.eth.Contract(CafeRouter02.abi)
                          .deploy({
                            data: "0x" + CafeRouter02.evm.bytecode.object, 
                            arguments: [
                              data_object.contract_address.cafe_factory,
                              wETH.options.address]})
                          .send({
                            from: accounts[0]
                          })
  console.log(`\nCafeRouter02 contract deployed at ${cafeRouter02.options.address}`);
  console.log(`Please store this router address for future use ^^^`);
  data_object.contract_address.cafe_router_02 = cafeRouter02.options.address;

  let data_to_write = JSON.stringify(data_object, null, 2);
  await write_data(data_to_write);


  await provider.engine.stop();
})();