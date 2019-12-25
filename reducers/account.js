import {
  ADD_ACCOUNT,
  UPDATE_BALANCE,
  UPDATE_LAST_LOG,
  FETCH_NONCE_SUCCESS,
  FETCH_TBALANCE_REQUEST,
  FETCH_TBALANCE_SUCCESS,
  UPDATE_ASSET
} from '../actions'

const initialState = {
  'address': null,
  'privateKey': null,
  'mnemonic': null,
  'balance': 0.0000,
  'lastLog': null,
  'nonce': 0,
  'token': 0.0000,
  'asset': 0.00
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACCOUNT:
      return Object.assign({}, state, {
        address: action.account
      })
    case UPDATE_BALANCE:
      return Object.assign({}, state, {
        balance: action.balance
      })
    case UPDATE_LAST_LOG:
      return Object.assign({}, state, {
        lastLog: action.data
      })
    case FETCH_NONCE_SUCCESS:
      return Object.assign({}, state, {
        nonce: action.data
      })
    case FETCH_TBALANCE_REQUEST:
      return Object.assign({}, state, {
        token: 0.0000
      })
    case FETCH_TBALANCE_SUCCESS:
      return Object.assign({}, state, {
        token: action.data
      })
    case UPDATE_ASSET:
      return Object.assign({}, state, {
        asset: action.data
      })
    default:
      return state
  }
}
