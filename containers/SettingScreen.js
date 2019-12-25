import React, {Component} from 'react'
import {AsyncStorage, Button, View, Text} from 'react-native'

const list = [
  {name:'关于'},
  {name:'版本'}
]

export default class SettingScreen extends Component {
  static navigationOptions = {
    title: '设置',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }

  _clear = async() => {
    try {
      await AsyncStorage.clear()
      this.props.navigation.navigate('Auth')
    } catch(error) {
    }
  }

  render() {
    return (
      <View style={{flex:1,paddingTop:15}}>
        <Button title='删除钱包' color='#212b66' onPress={this._clear} />
      </View>
    )
  }
}
