import web3 from './web3.js';

// Import the abi file 
import Campaign from './build/Campaign.json';

// Web3 creates the instance of the Campaign from abi
// address is provided to the function

export default (address) => {
  return new web3.eth.Contract(
    Campaign.abi,
    address
  );
};
