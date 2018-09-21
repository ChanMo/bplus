import React, {Component} from 'react'
import {Image, StatusBar, View, Text, TouchableOpacity} from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import FinanceScreen from './FinanceScreen'
import WalletScreen from './WalletScreen'
//import AssetStack from './AssetStack'
import AssetScreen from './AssetScreen'
import UserScreen from './UserScreen'

//var Web3 = require('web3')
//var web3 = new Web3(new Web3.providers.HttpProvider('http://47.94.206.167:8545'))
//console.log(web3.eth.gasPrice)
//
//web3.eth.getProtocolVersion().then(console.log)
//web3.eth.getAccounts().then((res)=>console.log(res))
//setInterval(()=>console.log(web3.currentProvider), 5000)


const Footer = createBottomTabNavigator({
  //Asset: AssetScreen,
  Wallet: WalletScreen,
  //Finance: FinanceScreen,
  User: UserScreen,
}, {
  initialRouteName: 'Wallet',
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, tintColor}) => {
      const { routeName } = navigation.state
      let iconName
      if(routeName === 'Asset') {
        iconName = focused ? require('../images/zc_icon_xz.png') : require('../images/zc_icon.png')
      } else if (routeName === 'Wallet') {
        iconName = focused ? require('../images/qb_icon_xz.png') : require('../images/qb_icon.png')
      } else if (routeName === 'Finance') {
        iconName = focused ? require('../images/lc_icon_xz.png') : require('../images/lc_icon.png')
      } else {
        iconName = focused ? require('../images/wd_icon_xz.png') : require('../images/wd_icon.png')
      }
      //return <Icon name={iconName} size={25} color={tintColor} />
      return <Image source={iconName} style={{width:26,height:26}} />
    },
    tabBarLabel: ({focused, tintColor}) => {
      const { routeName } = navigation.state
      let label
      if(routeName === 'Asset') {
        label = '资产'
      } else if (routeName === 'Wallet') {
        label = '钱包'
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
  static navigationOptions = ({navigation}) => ({
    header: null,
    title: 'B+',
    headerRight: (
      <TouchableOpacity
        onPress={()=>navigation.navigate('Setting')}>
        <Icon
          name='ios-menu'
          size={24}
          style={{marginRight:15}} />
      </TouchableOpacity>
    )
  })

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar
          barStyle='light-content'
          translucent={true}
          backgroundColor='transparent' />
        <Footer navigation={this.props.navigation} />
      </View>
    )
  }
}

HomeScreen.router = Footer.router
