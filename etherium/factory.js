import web3 from './web3.js';
import CampaignFactory from './build/CampaignFactory.json';

// Web3 creates the instance of the CampaignFactory from deployed file on network
const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x80bF494a26913261785F053fB7B40c5982e5B674'
  //Old contract address'0x10440539Af294B0FbaeBe8dE12D700e344ea5034'
);

export default instance;
