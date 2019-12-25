import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunkMiddleware from 'redux-thunk'

import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['logs'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(
    persistedReducer,
    applyMiddleware(
      thunkMiddleware,
    ),
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  let persistor = persistStore(store)
  return { store, persistor }
}
