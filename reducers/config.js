import {
  UPDATE_CONFIG
} from '../actions'

const initialState = {
  'web3': 'http://47.244.0.145:8545',
  'web3_wss': 'wss://mainnet.infura.io/ws/v3/c5ecf0f3fad2436e94fa74e57b0f4c50',
  'market': 'http://admin.bijia666.com/getCryptocurrency.html'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}
