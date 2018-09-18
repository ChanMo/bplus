import React, {Component} from 'react'
import {View, AsyncStorage, ActivityIndicator} from 'react-native'

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props)
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const wallet = await AsyncStorage.getItem('wallet')
    this.props.navigation.navigate(wallet ? 'App' : 'Auth')

  }

  render() {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
}
