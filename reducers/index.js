import { combineReducers } from 'redux'
import account from './account'
import tokens from './tokens'
import market from './market'
import config from './config'
import pending from './pending'
import log from './log'

const rootReducer = combineReducers({
  account,
  tokens,
  market,
  config,
  pending,
  log
})

export default rootReducer
