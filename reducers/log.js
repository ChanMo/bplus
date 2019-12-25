import {
  FETCH_LOG_REQUEST,
  FETCH_LOG_SUCCESS,
  FETCH_LOG_FAILURE
} from '../actions'

const initialState = {
  fetching: false,
  data: [],
  error: false,
}

export default (state=initialState, action) => {
  switch(action.type) {
    case FETCH_LOG_REQUEST:
      return Object.assign({}, state, {
        fetching: true,
        data: [],
        error: false
      })
    case FETCH_LOG_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        data: action.data,
        error: false
      })
    case FETCH_LOG_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        error: action.error
      })
    default:
      return state
  }
}
