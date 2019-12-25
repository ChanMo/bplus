import {
  ADD_PENDING,
  REMOVE_PENDING,
  UPDATE_PENDING,
  CLEAR_PENDING
} from '../actions'

const initialState = [{
  'hash': '0xfca89d57897034d157d4c47fa5062e8a9a97ec2562fa27f1330e36a634ffb08e',
  'token': 'ETH',
  'from': '0x80f891685b78c5085a49886b4a95852d3d020be0',
  'to': '0xe544c47c19d466fa9ed5550c8173e11b38f0a8d8',
  'value': 0.01,
  'timestamp': Date.now()
}]

export default (state=initialState, action) => {
  switch (action.type) {
    case ADD_PENDING:
      //return state.concat(action.data)
      return [...state, action.data]
    case UPDATE_PENDING:
      let index = state.findIndex(item => item.hash == action.data.hash)
      let copy = state.slice()
      copy.splice(index, 1, action.data)
      return copy
    case REMOVE_PENDING:
      return state.filter(item=>item.hash !== action.hash)
    case CLEAR_PENDING:
      return state.filter(item=>item.confirmation !== 24)
    default:
      return state
  }
}
