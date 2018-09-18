import React, {Component} from 'react'
import {StatusBar, Platform, StyleSheet, Text, View} from 'react-native'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

import WelcomeScreen from './containers/WelcomeScreen'
import WebScreen from './containers/WebScreen'
import HomeScreen from './containers/HomeScreen'
import SettingScreen from './containers/SettingScreen'
import AssetAddScreen from './containers/AssetAddScreen'
import AboutScreen from './containers/AboutScreen'
import GroupScreen from './containers/GroupScreen'
import LogScreen from './containers/LogScreen'
import SetPasswordScreen from './containers/SetPasswordScreen'
import ImportScreen from './containers/ImportScreen'
import AuthLoadingScreen from './containers/AuthLoadingScreen'
import PasswordScreen from './containers/PasswordScreen'
import TransferScreen from './containers/TransferScreen'
import ReceiptScreen from './containers/ReceiptScreen'
import CoinScreen from './containers/CoinScreen'

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Setting: SettingScreen,
  AssetAdd: AssetAddScreen,
  About: AboutScreen,
  Group: GroupScreen,
  Log: LogScreen,
  Web: WebScreen,
  Transfer: TransferScreen,
  Receipt: ReceiptScreen,
  Coin: CoinScreen
}, {
  initialRouteName: 'Home'
})

const AuthStack = createStackNavigator({
  Welcome: WelcomeScreen,
  SetPassword: SetPasswordScreen,
  Import: ImportScreen
})

const RootStack = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppStack,
  Auth: AuthStack
}, {
  initialRouteName: 'AuthLoading'
})

const MainStack = createStackNavigator({
  Root: RootStack,
  Password: PasswordScreen
}, {
  mode: 'modal',
  headerMode: 'none'
})


export default class App extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <MainStack />
      </View>
    )
  }
}
