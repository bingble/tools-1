const c = require('./contract.js')

async function getMortgage(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("Mortgage")
  return logs
}

async function getRepay(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("Repay")
  return logs
}

async function getMint(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("Mint")
  return logs
}

async function getBurn(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("Burn")
  return logs
}

async function getBuyToken(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("BuyToken")
  return logs
}

async function getSellToken(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("SellToken")
  return logs
}

async function getDebtUpdate(address) {
  const contract = c.getPairContract(address)
  const logs = await contract.queryFilter("DebtUpdate")
  return logs
}

module.exports = {
  getMortgage,
  getRepay,
  getMint,
  getBurn,
  getBuyToken,
  getSellToken,
  getDebtUpdate
}