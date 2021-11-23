// Testing assertions with mocha
const assert = require('assert');

// Ganache-cli setup for local testing
const ganache = require('ganache-cli');
const Web3 = require('web3');

// This is where the network is connecting to attempt
// Ganache is local network
const web3 = new Web3(ganache.provider());

// Get the abi and evm from compiled contract
// This part is sensitive to the JSON structure of compiled contract
// Pick the contract abi and evm (containing byte code) from the file

const compiledFactory = require ('../etherium/build/CampaignFactory.json');
const compiledCampaign = require ('../etherium/build/Campaign.json');

// Initiate variables - accounts on the network
let accounts;

// Instance of the contract
let factory;
let campaignAddress;
let campaign;


beforeEach (async () => {
  // Get a list of all accounts
  // await makes sure to get a response before moving on
  accounts = await web3.eth.getAccounts();

  // Deploys a contract called 'CampaignFactory'
  // (1) .deployable contract using "abi",
  // (2) .deploy the "bytecode",
  // (3) .specify the account and gas to initiate

  // Create instance of the Campaign factory
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({from: accounts[0], gas: '1500000'});

  // Create campaign
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas:'1500000'
  });

  // return the array of campaign addresses
  // notation uses [] for first address in the array
  [campaignAddress] =  await factory.methods.getDeployedCampaigns().call();

  // Get the handle to campaign contract with the address
  campaign = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress
  );
});

// Check to make sure the contract is deployed
describe( 'Campaigns', () => {
  it ('deploys a factory and a campaign', () => {
    //  Factory contract has been deployed
    assert.ok(factory.options.address);

    // The first instance of Campaign instance is deployed
    assert.ok(campaign.options.address);

  });

  it ('marks caller as the campaign manager', async () => {
    // Contribute from a different account to the campaign
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    // call to check if contributor is added to the approvers list
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert (isContributor);

  });

  it("allows people to contribute money and marks them as approvers", async () => {
  await campaign.methods.contribute().send({
    value: "200",
    from: accounts[1]
  });

  const isContributor = await campaign.methods.approvers(accounts[1]).call();
  assert(isContributor);
});

  it ('requires a minimum contribution', async () => {
    // negative test case
    try {
      await campaign.methods.contribute().send({
        value: 5,
        from: accounts[1]
      });
      assert(false);

    } catch (err) {
      assert(err);
    }
  });

  it ('allows a manager to make a payment request', async() => {
    // Call the campaign method and pass the required variables
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1500000"
    });

    // Per the contract deployed first request to 0
    const request = await campaign.methods.requestsmap(0).call();
    assert.equal("Buy batteries", request.description);

  });

  it ('processes requests', async () => {
    // Become a contributor
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('10','ether')
    });

    // Manager creates a spending request
    await campaign.methods
      .createRequest('A new spending request', web3.utils.toWei('5','ether'), accounts[2])
      .send({
        from: accounts[0], gas: '1000000'
      });

    // The contributor approves the request
    await campaign.methods.approveRequest(0)
      .send ({
        from: accounts[1], gas: '1000000'
    });

    // Manager finalizes the request
    await campaign.methods.finalizeRequest(0)
      .send ({
        from: accounts[0], gas: '1000000'
    });

    // Check balance is more than 103
    let balance = await web3.eth.getBalance(accounts[2]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert (balance > 104);

  });




});
