import { createStackNavigator } from 'react-navigation'
import AssetScreen from '../containers/AssetScreen'
import AssetAddScreen from '../containers/AssetAddScreen'

export default createStackNavigator({
  main: AssetScreen,
  add: AssetAddScreen
}, {
  navigationOptions: {
  }
})
