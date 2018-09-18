import React, {Component} from 'react'
import {View, Text} from 'react-native'

export default class CoinScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigationOptions.getParam('coin')
  })

  render() {
    return (
      <View style={{flex:1}}>
        <Text>1200.0000</Text>
      </View>
    )
  }
}
