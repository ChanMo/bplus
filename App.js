import React, {Component} from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import BackgroundTask from 'react-native-background-task'
import RootContainer from './containers/RootContainer'
import configureStore from './configureStore'
const { persistor, store } = configureStore()

import runService from './service'

BackgroundTask.define(async()=>{
  console.log('run background task')
  await runService()
  BackgroundTask.finish()
})

export default class App extends Component {
  componentDidMount() {
    BackgroundTask.schedule()
  }

  render() {
    return (
      <Provider store={store}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content" />
        <PersistGate loading={null} persistor={persistor}>
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }
}
