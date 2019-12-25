import {
  ADD_TOKEN,
  UPDATE_TOKEN,
  REMOVE_TOKEN
} from '../actions'

//const initialState = ['ETH', 'BHB','BCB','BCASH']
const initialState = [
  {'token': 'ETH', 'balance': 0.0000},
]

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      return [
        ...state,
        {'token': action.token, 'balance': 0.0000}
      ]
    case UPDATE_TOKEN:
      //return state.filter(item => item.token !== action.data.token).concat(action.data).sort()
      let index = state.findIndex(item => item.token == action.data.token)
      let copy = state.slice()
      copy.splice(index, 1, action.data)
      return copy
    case REMOVE_TOKEN:
      return state.filter(item=>item.token !== action.token)
    default:
      return state
  }
}
