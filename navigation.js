import { Easing, Animated } from 'react-native'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

import WelcomeScreen from './containers/WelcomeScreen'
import WebScreen from './containers/WebScreen'
import HomeScreen from './containers/HomeScreen'
import SettingScreen from './containers/SettingScreen'
import AboutScreen from './containers/AboutScreen'
import GroupScreen from './containers/GroupScreen'
import LogScreen from './containers/LogScreen'
import SetPasswordScreen from './containers/SetPasswordScreen'
import ImportSeedScreen from './containers/ImportSeedScreen'
import AuthLoadingScreen from './containers/AuthLoadingScreen'
import PasswordScreen from './containers/PasswordScreen'
import TransferScreen from './containers/TransferScreen'
import ReceiptScreen from './containers/ReceiptScreen'
import CoinScreen from './containers/CoinScreen'
import CoinListScreen from './containers/CoinListScreen'
import ScannerScreen from './containers/ScannerScreen'
import ConversionScreen from './containers/ConversionScreen'
import ServiceConfigScreen from './containers/ServiceConfigScreen'
//mxh
//我的
//import IncomeScreen from './containers/IncomeScreen'
import ToolListScreen from './containers/ToolListScreen'
import ChangePasswordScreen from './containers/ChangePasswordScreen'

import BackupsScreen from './containers/BackupsScreen'
import CopyWordScreen from './containers/CopyWordScreen'
import ValidateWordScreen from './containers/ValidateWordScreen'

import DelectHintScreen from './containers/DelectHintScreen'
import DelectWalletScreen from './containers/DelectWalletScreen'

import DerivedKeyScreen from './containers/DerivedKeyScreen'
import DetailScreen from './containers/DetailScreen'
//使用协议和隐私条款
import AgreementScreen from './containers/AgreementScreen'
import PrivacyScreen from './containers/PrivacyScreen'
import ContactScreen from './containers/ContactScreen'

//子页面
const AppStack = createStackNavigator({
  Home: HomeScreen,
  Setting: SettingScreen,
  About: AboutScreen,
  Group: GroupScreen,
  Log: LogScreen,
  Transfer: TransferScreen,
  Receipt: ReceiptScreen,
  Coin: CoinScreen,
  CoinList: CoinListScreen,
  ToolList: ToolListScreen,
  Backups: BackupsScreen,
  CopyWord: CopyWordScreen,
  ValidateWord: ValidateWordScreen,
  DelectHint: DelectHintScreen,
  DelectWallet:DelectWalletScreen,
  DerivedKey: DerivedKeyScreen,
  Web: WebScreen,
  Detail: DetailScreen,
  ChangePassword: ChangePasswordScreen,
  Conversion: ConversionScreen,
  ServiceConfig: ServiceConfigScreen,
  Privacy:PrivacyScreen,
  Agreement:AgreementScreen,
  Contact:ContactScreen
}, {
  initialRouteName:'Home',
  mode:'card',
  headerLayoutPreset:'center',
  transitionConfig: () => ({
    transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
        const {layout, position, scene} = sceneProps;
        const {index} = scene;
        const Width = layout.initWidth;
        //沿X轴平移
        const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [Width, 0, -(Width - 10)],
        });
        //透明度
        const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
        });
        return {opacity, transform: [{translateX}]};
    }
  })
})

//独立页面
const AuthStack = createStackNavigator({
  Welcome: WelcomeScreen,
  SetPassword: SetPasswordScreen,
  ImportSeed: ImportSeedScreen,
  Web: WebScreen,
}, {
  mode:'card',
  headerLayoutPreset:'center',
  transitionConfig: () => ({
    transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
        const {layout, position, scene} = sceneProps;
        const {index} = scene;
        const Width = layout.initWidth;
        //沿X轴平移
        const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [Width, 0, -(Width - 10)],
        });
        //透明度
        const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
        });
        return {opacity, transform: [{translateX}]};
    }
  })
})

const RootStack = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppStack,
  Auth: AuthStack
}, {
  initialRouteName: 'AuthLoading'
})

export default createStackNavigator({
  Root: RootStack,
  Password: PasswordScreen,
  Scanner: ScannerScreen
}, {
  mode: 'modal',
  headerMode: 'none'
})
