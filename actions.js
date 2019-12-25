import { AsyncStorage } from 'react-native'
import Toast from 'react-native-simple-toast'
import tokens from './tokens'

export const FETCH_LOG_REQUEST = 'FETCH_LOG_REQUEST'
export function fetchLogRequest() {
  return { type: FETCH_LOG_REQUEST }
}

export const FETCH_LOG_SUCCESS = 'FETCH_LOG_SUCCESS'
export function fetchLogSuccess(data) {
  return { type: FETCH_LOG_SUCCESS, data}
}

export const FETCH_LOG_FAILURE = 'FETCH_LOG_FAILURE'
export function fetchLogFailure(error) {
  return { type: FETCH_LOG_FAILURE, error }
}

export const UPDATE_ASSET = 'UPDATE_ASSET'
export function updateAsset(data) {
  return { type: UPDATE_ASSET, data }
}

export const ADD_PENDING = 'ADD_PENDING'
export function addPending(data) {
  return { type: ADD_PENDING, data }
}

export const UPDATE_PENDING = 'UPDATE_PENDING'
export function updatePending(data) {
  return { type: UPDATE_PENDING, data }
}

export const REMOVE_PENDING = 'REMOVE_PENDING'
export function removePending(hash) {
  return { type: REMOVE_PENDING, hash}
}

export const CLEAR_PENDING = 'CLEAR_PENDING'
export function clearPending() {
  return { type: CLEAR_PENDING }
}

export const FILTER_PENDING = 'FILTER_PENDING'
export function filterPending(token) {
  return { type: FILTER_PENDING, token }
}

export const UPDATE_LAST_LOG = 'UPDATE_LAST_LOG'
export function updateLastLog(data) {
  return { type: UPDATE_LAST_LOG, data }
}

export const UPDATE_CONFIG = 'UPDATE_CONFIG'
export function updateConfig(data) {
  return { type: UPDATE_CONFIG, data }
}

export const ADD_ACCOUNT = 'ADD_ACCOUNT'
export function addAccount(account) {
  return { type: ADD_ACCOUNT, account }
}

export const UPDATE_BALANCE = 'UPDATE_BALANCE'
export function updateBalance(balance) {
  return { type: UPDATE_BALANCE, balance }
}

export const ADD_TOKEN = 'ADD_TOKEN'
export function addToken(token) {
  return { type: ADD_TOKEN, token }
}

export const UPDATE_TOKEN = 'UPDATE_TOKEN'
export function updateToken(data) {
  return { type: UPDATE_TOKEN, data }
}

export const REMOVE_TOKEN = 'REMOVE_TOKEN'
export function removeToken(token) {
  return { type: REMOVE_TOKEN, token }
}

export const FETCH_MARKET_REQUEST = 'FETCH_MARKET_REQUEST'
export function fetchMarketRequest() {
  return { type: FETCH_MARKET_REQUEST }
}

export const FETCH_MARKET_SUCCESS = 'FETCH_MARKET_SUCCESS'
export function fetchMarketSuccess(response) {
  return { type: FETCH_MARKET_SUCCESS, response:response }
}

export const FETCH_MARKET_FAILURE = 'FETCH_MARKET_FAILURE'
export function fetchMarketFailure(error) {
  return { type: FETCH_MARKET_FAILURE, error:error }
}

export function fetchMarket(api) {
  return function(dispatch) {
    dispatch(fetchMarketRequest)
    return fetch(api, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': 'afa301a7-3f5d-4694-b87c-eb48e6e07cc8'
      }
    })
      .then(response => response.json())
      .then(json => dispatch(fetchMarketSuccess(json.data)))
      .catch(error => dispatch(fetchMarketFailure(error.toString())))
  }
}

export function fetchLog(account, coin='ETH', page=1, offset=20) {
  return function(dispatch) {
    dispatch(fetchLogRequest())
    let url
    if(coin == 'ETH') {
      url = `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=latest&page=${page}&offset=${offset}&sort=desc&apikey=G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W`
    } else {
      const tokenData = tokens[coin]
      const contract = tokenData.address
      url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contract}&address=${account}&page=${page}&offset=${offset}&sort=desc&apikey=G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W`
    }
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(fetchLogSuccess(json.result)))
      .catch(error => dispatch(fetchLogFailure(error.message)))
  }
}

export function fetchBalance(address, token='ETH') {
  return function(dispatch) {
    if(token == 'ETH') {
      web3.eth.getBalance(address).then(res=>{
        dispatch(updateBalance(web3.utils.fromWei(res)))
        dispatch(updateToken({
          'token': 'ETH',
          'balance': parseFloat(web3.utils.fromWei(res))
        }))
      })
    } else {
      let tokenData = tokens[token]
      let contract = new web3.eth.Contract(
        JSON.parse(tokenData.abi),
        tokenData.address)
      contract.methods.balanceOf(address)
        .call()
        .then((res) => dispatch(updateToken({
          'token': token,
          'balance': parseFloat(web3.utils.fromWei(res))
        })))
    }
  }
}

export const FETCH_NONCE_SUCCESS = 'FETCH_NONCE_SUCCESS'
export function fetchNonceSuccess(data) {
  return { type: FETCH_NONCE_SUCCESS, data }
}

export function fetchNonce(address) {
  return function(dispatch) {
    web3.eth.getTransactionCount(address).then(res=>{
      dispatch(fetchNonceSuccess(res))
    })
  }
}

export const FETCH_TBALANCE_REQUEST = 'FETCH_TBALANCE_REQUEST'
export function fetchTbalanceRequest() {
  return { type: FETCH_TBALANCE_REQUEST }
}

export const FETCH_TBALANCE_SUCCESS = 'FETCH_TBALANCE_SUCCESS'
export function fetchTbalanceSuccess(data) {
  return { type: FETCH_TBALANCE_SUCCESS, data }
}

export function fetchTbalance(address, token) {
  return function (dispatch) {
    let tokenData = tokens[token]
    let contract
    if (tokenData) {
      contract = new web3.eth.Contract(
        JSON.parse(tokenData.abi),
        tokenData.address)
      return contract.methods.balanceOf(address)
        .call()
        .then((res) => {
          let balance = web3.utils.fromWei(res)
          dispatch(fetchTbalanceSuccess(balance))
        })
    } else {
      dispatch(fetchTbalanceSuccess(0.0000))
    }
  }
}

export function sendTransaction(data) {
  return async function(dispatch) {
    let transaction = {
      token: data.token,
      from: data.from.toLowerCase(),
      to: data.to.toLowerCase(),
      value: web3.utils.toWei(data.value)
    }
    web3.eth.sendSignedTransaction(data.signData)
      .once('transactionHash', function(hash) {
        console.log('hash', hash)
        transaction['hash'] = hash
        transaction['status'] = 1
        transaction['timestamp'] = Date.now()
        dispatch(addPending(transaction))
        Toast.show('转帐已提交',1)
      })
      .once('receipt', function(receipt){
        console.log('receipt', receipt)
        transaction['status'] = 2
        dispatch(updatePending(transaction))
      })
      .on('confirmation', function(confirmationNumber, receipt) {
        console.log('confirmation', confirmationNumber, typeof(confirmationNumber))
        transaction['confirmation'] = confirmationNumber
        transaction['status'] = 3
        dispatch(updatePending(transaction))
      })
      .on('error', function(error) {
        console.log('error:', error)
        //transaction['status'] = 0
        //transaction['error'] = error.toString()
        //dispatch(updatePending(transaction))
        Toast.show(error.toString(),1)
      })
  }
}

export function checkPending(pendings) {
  return function(dispatch) {
    let hash, url
    pendings.map(item => {
      hash = item.hash
      url = 'https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash='+hash+'&apikey=G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W'
      fetch(url).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.result.status == "1") {
            console.log('remove pending', hash)
            dispatch(removePending(hash))
          }
        })
    })
  }
}
