import React, {Component} from 'react'
import {AsyncStorage, Image, View, Text, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'

import FinanceScreen from './FinanceScreen'
import WalletScreen from './WalletScreen'
import FindScreen from './FindScreen'
import UserScreen from './UserScreen'

const Footer = createBottomTabNavigator({
  Wallet: WalletScreen,
  Find: FindScreen,
  //Finance: FinanceScreen,
  User: UserScreen,
}, {
  initialRouteName: 'Wallet',
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, tintColor}) => {
      const { routeName } = navigation.state
      let iconName
      if(routeName === 'Find') {
        iconName = focused ? require('../images/fx_icon_xz.png') : require('../images/fx_icon.png')
      } else if (routeName === 'Wallet') {
        iconName = focused ? require('../images/qb_icon_xz.png') : require('../images/qb_icon.png')
      } else if (routeName === 'Finance') {
        iconName = focused ? require('../images/lc_icon_xz.png') : require('../images/lc_icon.png')
      } else {
        iconName = focused ? require('../images/wd_icon_xz.png') : require('../images/wd_icon.png')
      }
      return <Image source={iconName} style={{width:26,height:26}} />
    },
    tabBarLabel: ({focused, tintColor}) => {
      const { routeName } = navigation.state
      let label
      if(routeName === 'Find') {
        label = '发现'
      } else if (routeName === 'Wallet') {
        label = '钱包'
      } else if (routeName === 'Finance') {
        label = '理财'
      } else {
        label = '我的'
      }
      return <Text style={{textAlign:'center',color:tintColor,fontSize:12,marginBottom:2}}>{label}</Text>
    }
  }),
  tabBarOptions: {
    activeTintColor: '#212b66'
  }
})

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <Footer navigation={this.props.navigation} />
    )
  }
}

HomeScreen.router = Footer.router
