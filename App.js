import React, {Component} from 'react'
import {StatusBar, Platform, StyleSheet, Text, View} from 'react-native'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

import WelcomeScreen from './containers/WelcomeScreen'
import WebScreen from './containers/WebScreen'
import HomeScreen from './containers/HomeScreen'
import SettingScreen from './containers/SettingScreen'
import AssetAddScreen from './containers/AssetAddScreen'
import CreateWalletScreen from './containers/CreateWalletScreen'
import AboutScreen from './containers/AboutScreen'
import GroupScreen from './containers/GroupScreen'
import LogScreen from './containers/LogScreen'
import SetPasswordScreen from './containers/SetPasswordScreen'
import ImportScreen from './containers/ImportScreen'
import ImportSeedScreen from './containers/ImportSeedScreen'
import ExportScreen from './containers/ExportScreen'
import AuthLoadingScreen from './containers/AuthLoadingScreen'
import PasswordScreen from './containers/PasswordScreen'
import TransferScreen from './containers/TransferScreen'
import ReceiptScreen from './containers/ReceiptScreen'
import CoinScreen from './containers/CoinScreen'
import CoinListScreen from './containers/CoinListScreen'
//mxh
//我的
import IncomeScreen from './containers/IncomeScreen'
import ToolListScreen from './containers/ToolListScreen'
import ChangePasswordScreen from './containers/ChangePasswordScreen'

import BackupsScreen from './containers/BackupsScreen'
import CopyWordScreen from './containers/CopyWordScreen'
import ValidateWordScreen from './containers/ValidateWordScreen'
import DelectHintScreen from './containers/DelectHintScreen'
import DelectWalletScreen from './containers/DelectWalletScreen'

import DerivedKeyScreen from './containers/DerivedKeyScreen'
import DetailScreen from './containers/DetailScreen'

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
  Coin: CoinScreen,
  Export: ExportScreen,
  CoinList: CoinListScreen,
  Income: IncomeScreen,
  ToolList: ToolListScreen,
  Backups: BackupsScreen,
  CopyWord: CopyWordScreen,
  ValidateWord: ValidateWordScreen,
  DelectHint: DelectHintScreen,
  DelectWallet:DelectWalletScreen,
  DerivedKey: DerivedKeyScreen,
  Detail: DetailScreen,
  ChangePassword: ChangePasswordScreen
}, {
  initialRouteName: 'Home'
})

const AuthStack = createStackNavigator({
  Welcome: WelcomeScreen,
  // Welcome: DetailScreen,
  SetPassword: SetPasswordScreen,
  CreateWallet: CreateWalletScreen,
  Import: ImportScreen,
  ImportSeed: ImportSeedScreen
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
