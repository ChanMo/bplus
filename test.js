var Web3 = require("web3")

var web3 = new Web3("http://47.94.206.167:8545")

web3.eth.getAccounts(console.log)
