import React, {Component} from 'react'
import {AsyncStorage, View, TextInput, Text, Button} from 'react-native'

export default class SetPasswordScreen extends Component {
  static navigationOptions = {
    title: '创建钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: null,
      fetching: false,
    }
  }

  _createWallet = async () => {
    this.setState({fetching:true})
    try {
      let wallet = '0x01c310737e568f590287cee6ffa729ee937ebe4c'
      await AsyncStorage.setItem('wallet', wallet)
      this.props.navigation.navigate('App')
    } catch(error) {
      console.log('error', error)
    }
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{padding:30}}>
        <Text style={{fontWeight:'bold',color:'#212b66',marginBottom:15}}>
          请设置交易密码</Text>
        <View style={{borderWidth:1,borderColor:'#b2b2b2',marginBottom:50}}>
          <TextInput
            value={this.state.value}
            onChangeText={(value) => this.setState({value:value})}
            keyboardType='number-pad' />
        </View>
        {this.state.fetching ? (
          <Button
            color='#212b66'
            title='创建中...'
            onPress={()=>null}
            disabled />
        ) : (
          <Button
            color='#212b66'
            onPress={this._createWallet}
            title='下一步' />
          )}
      </View>
    )
  }
}
