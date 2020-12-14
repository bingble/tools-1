const { ethers } = require("ethers");
const FACTORY_ABI = require('./abis/factory.json')
const PAIR_ABI = require('./abis/pair.json')

const provider = new ethers.providers.InfuraProvider(
  process.env.APP_CHAIN.toLowerCase(), {
  projectId: process.env.APP_INFURA_ID,
});

function getContract(address, ABI) {
  return new ethers.Contract(address, ABI, provider)
}

function getPairContract(pairAddress) {
  return getContract(pairAddress, PAIR_ABI)
}

function getFactoryContract() {
  return getContract(process.env.APP_ADDRESS_FACTORY, FACTORY_ABI)
}

module.exports = {
  getPairContract,
  getFactoryContract,
  provider
}