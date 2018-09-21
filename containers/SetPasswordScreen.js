import React, {Component} from 'react'
import {Alert, AsyncStorage, View, TextInput, Text, Button} from 'react-native'

export default class SetPasswordScreen extends Component {
  static navigationOptions = {
    title: '创建钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      password: null,
      passwordValid: false,
      fetching: false,
    }
  }

  _setPassword(value) {
    let valid = false
    if(value && value.length >= 6) {
      valid = true
    }
    this.setState({
      password: value,
      passwordValid: valid
    })
  }

  _createWallet = () => {
    this.setState({fetching:true})
    console.log(this.state.password)
    web3.eth.personal.newAccount(this.state.password).then((account)=>{
      console.log(account)
      this._storeAccount(account)
      this.props.navigation.navigate('App')
    }).catch((error)=>Alert.alert(error.toString()))
  }

  _storeAccount = async(account) => {
    await AsyncStorage.setItem('account', account)
  }

  _renderButton = () => {
    if(!this.state.passwordValid) {
      return <Button color='#212b66' title='下一步' disabled onPress={()=>null} />
    }else if(this.state.fetching) {
      return <Button color='#212b66' title='创建中...' disabled onPress={()=>null} />
    }else{
      return <Button color='#212b66' title='下一步' onPress={this._createWallet} />
    }
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{padding:30}}>
        <Text style={{fontWeight:'bold',color:'#212b66',marginBottom:15}}>
          请设置交易密码</Text>
        <View style={{borderWidth:1,borderColor:'#b2b2b2',paddingVertical:10,paddingHorizontal:10,marginBottom:50}}>
          <TextInput
            secureTextEntry={true}
            value={this.state.value}
            onChangeText={(value) => this._setPassword(value)}
            keyboardType='number-pad' />
        </View>
        {this._renderButton()}
      </View>
    )
  }
}
