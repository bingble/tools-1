const dotenv = require("dotenv")
dotenv.config()
const token = require('./token.js')
const pair = require('./pair.js')
const fs = require('fs');

const deadlineBlock = 11439072
const flagMap = new Map()
const userWithoutRepay = []
let repayIDs = []

const enu = {
  "Mortgage": 0,
  "Mint": 1,
  "Burn": 2,
  "BuyToken": 3,
  "SellToken": 4,
  "DebtUpdate": 5,
}

// write data to file
function write(data, name, pairAddress) {
  const toFile = []
  for (d of data) {
    const tmp = {
      blockNumber: d.blockNumber,
      args: [],
    }
    if (Number(d.blockNumber) > deadlineBlock) {
      continue
    }
    for (a of d.args) {
      tmp.args.push(a.toString())
    }
    if (name !== "Repay") {
      let key
      switch(name) {
        case "BuyToken":
          key = tmp.args[3].toString()
          break;
        case "SellToken":
          key = tmp.args[3].toString()
          break;
        case "Burn":
          key = tmp.args[4].toString()
          break;
        default:
          key = tmp.args[0].toString()
      }

      const old = flagMap.get(key)
      if (old !== undefined) {
        old[enu[name]] = 1
      } else {
        flagMap.set(key, [0,0,0,0,0,0])
      }
    }

    if (name === "DebtUpdate") {
      if (tmp.args[2] === "0" && tmp.args[3] === "0" && tmp.args[4] === "0" && tmp.args[5] === "0") {
        repayIDs.push(tmp.args[0])
      }
    }
    toFile.push(tmp)
  }
  const fileName = "./data/" + name + "_" + pairAddress.toString() + ".json"
  fs.writeFile(fileName, JSON.stringify(toFile), (err) => {
    if (err) {
      console.log(err)
    }
  })
}

const promises = [];
token.getAllPairAddress().then(pairs => {
  for (address of pairs) {
    (function (addr) {
      const mortgage = pair.getMortgage(addr).then(data => {
        write(data, "Mortgage", addr)
      })

      const repay = pair.getRepay(addr).then(data => {
        write(data, "Repay", addr)
      })

      const mint = pair.getMint(addr).then(data => {
        write(data, "Mint", addr)
      })

      const burn = pair.getBurn(addr).then(data => {
        write(data, "Burn", addr)
      })

      const buytoken = pair.getBuyToken(addr).then(data => {
        write(data, "BuyToken", addr)
      })

      const selltoken = pair.getSellToken(addr).then(data => {
        write(data, "SellToken", addr)
      })

      const debtupdate = pair.getDebtUpdate(addr).then(data => {
        write(data, "DebtUpdate", addr)
      })

      promises.push(mortgage)
      promises.push(repay)
      promises.push(mint)
      promises.push(burn)
      promises.push(buytoken)
      promises.push(selltoken)
      promises.push(debtupdate)
    })(address)
  }

  Promise.all(promises).then(() => {
    flagMap.forEach((value, key) => {
      if(value.indexOf(0) === -1) {
        userWithoutRepay.push(key)
      }
    })

    const rewardUser =  userWithoutRepay.filter(item => {
      return repayIDs.indexOf(item) !== -1
    })

    console.log(rewardUser)
    console.log(rewardUser.length)
  })
})