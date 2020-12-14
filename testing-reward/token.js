const c = require('./contract.js')

async function getAllTokens() {
  const contract = c.getFactoryContract()
  const logs = await contract.queryFilter("PairCreated")
  const allTokens = {}
  for (const l of logs) {
    const data = l.args
    allTokens[data.token] = {
      name: data.symbol,
      symbol: data.symbol,
      decimals: data.decimals
    }
  }
  return allTokens
}

async function getPair(tokenAddress) {
  const contract = c.getFactoryContract()
  return contract.getPair(tokenAddress)
}

async function getAllPairAddress() {
  const allPairs = []
  const allTokens = await getAllTokens()
  for (address of Object.keys(allTokens)) {
    const pairAddress = await getPair(address)
    allPairs.push(pairAddress)
  }
  return allPairs
}

module.exports = {
  getAllTokens,
  getPair,
  getAllPairAddress
}