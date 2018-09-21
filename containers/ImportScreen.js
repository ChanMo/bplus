import React, {Component} from 'react'
import {AsyncStorage, Alert, View, TextInput, Text, Button} from 'react-native'

export default class ImportScreen extends Component {
  static navigationOptions = {
    title: '导入钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      keystore: null,
      keystoreValid: false
    }
  }

  _setKeystore(value) {
    let valid = false
    if(value.length > 30) {
      valid = true
    }
    this.setState({
      keystore: value,
      keystoreValid: valid
    })
  }

  _importAccount = () => {
    this.setState({fetching:true})
    const result = web3.eth.accounts.privateKeyToAccount(this.state.keystore)
    if(result && result.address) {
      console.log(result)
      let test = '0x01c310737e568f590287cee6ffa729ee937ebe4c'
      //this._storeAccount(result.address)
      this._storeAccount(test)
      this.setState({fetching:false})
      this.props.navigation.navigate('App')
    } else {
      Alert.alert('导入失败')
      this.setState({fetching:false})
    }
  }

  _storeAccount = async(account) => {
    await AsyncStorage.setItem('account', account)
  }

  _renderButton = () => {
    if(!this.state.keystoreValid) {
      return <Button color='#212b66' title='导入' disabled onPress={()=>null} />
    }else if(this.state.fetching) {
      return <Button color='#212b66' title='导入中...' disabled onPress={()=>null} />
    } else {
      return <Button color='#212b66' title='导入' onPress={this._importAccount} />
    }
  }

  render() {
    return (
      <View style={{flex:1,padding:30}}>
        <Text style={{fontWeight:'bold',marginBottom:15}}>
          请输入钱包keystore</Text>
        <View style={{borderWidth:1,borderColor:'lightgrey',borderRadius:2,marginBottom:30,padding:10}}>
          <TextInput
            numberOfLines={4}
            multiline={true}
            value={this.state.keystore}
            onChangeText={(value)=>this._setKeystore(value)}
          />
        </View>
        {this._renderButton()}
      </View>
    )
  }
}
