import tokens from './tokens'

export function formatTime(timestamp) {
  let date = new Date(parseInt(timestamp)*1000)
  return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

export function formatBalance(price, places=2) {
  return parseFloat(Math.round(price*100)/100).toFixed(places)
}

/**
 * 获取币种数量
 */
export function getBalance(account, token='ETH') {
  let balance = 0
  if(token == 'ETH') {
    balance = _getEthBalance(account)
  } else {
    let tokenData = tokens[token]
    if (tokenData) {
      balance = _getTokenBalance(account, JSON.parse(tokenData.abi), tokenData.address)
    }
  }
  return typeof(balance) == 'int' ? balance : 0
}

/**
 * 获取其他token数量
 */
function _getTokenBalance(account, abi, address) {
  let contract = new web3.eth.Contract(abi, address)
  return contract.methods.balanceOf(account).call()
    .then((res) => res)
    .catch((error)=>console.log('get token balance',error))
}

/**
 * 获取eth数量
 */
function _getEthBalance(account) {
  return web3.eth.getBalance(account)
    .then((res)=>web3.utils.fromWei(res, 'ether'))
    .catch((error)=>console.log(error))
}

/**
 * 获取市场数据
 */
export function getMarketData(tokens) {
  let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${tokens}&convert=CNY`
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-CMC_PRO_API_KEY': 'afa301a7-3f5d-4694-b87c-eb48e6e07cc8'
    }
  })
    .then((response) => response.json())
    .then((responseJson) => responseJson.data)
    .catch((error) => console.log(error))
}
