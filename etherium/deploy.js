// Bridge between the web3 instance and the network
const HDWalletProvider = require ('@truffle/hdwallet-provider');
const Web3 = require('web3');

// Get the abi and evm from compiled contract
// This part is sensitive to the JSON structure of compiled contract
const compiledFactory = require ('./build/CampaignFactory.json');

// Create a provider
const provider = new HDWalletProvider(
  'wear choose cloud upgrade this employ alarm gadget plunge toast country hire',
  'https://rinkeby.infura.io/v3/ded0b733d2584bb18c0a07c1a18d1fb0'
);

const web3 = new Web3(provider);

// Initiate variables
let accounts;
let inbox;

const deploy =  async () => {
    accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    // Creates a contract called 'Inbox'
    // (1) .deployable contract using "abi",
    // (2) .deploy the "bytecode",
    // (3) .specify the account and gas to initiate

    inbox = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object})
      .send({from: accounts[0], gas: '15000000'});

    console.log(compiledFactory.abi);
    console.log('Contract deployed to', inbox.options.address);
    provider.engine.stop();
};

deploy();
