import {
  FETCH_MARKET_REQUEST,
  FETCH_MARKET_SUCCESS,
  FETCH_MARKET_FAILURE
} from '../actions'

const initialState = {
  fetching: false,
  data: [],
  error: false,
}

export default (state=initialState, action) => {
  switch (action.type) {
    case FETCH_MARKET_REQUEST:
      return Object.assign({}, state, {
        fetching: true,
        error: false
      })
    case FETCH_MARKET_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        data: action.response,
        error: false
      })
    case FETCH_MARKET_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        error: action.error
      })
    default:
      return state
  }
}
