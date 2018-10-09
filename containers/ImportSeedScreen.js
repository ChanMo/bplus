import React,{Component} from 'react'
import {AsyncStorage, Alert, View, TextInput, Button, Text} from 'react-native'

var bip39 = require('bip39')
var HDKey = require('hdkey')
const ethUtil = require('ethereumjs-util')

export default class ImportSeedScreen extends Component {
  static navigationOptions = {
    title: '导入账户'
  }

  constructor(props) {
    super(props)
    this.state = {
      mnemonic: null
    }
  }

  _setMnemonic(value) {
    this.setState({mnemonic:value})
  }

  _submit = () => {
    let mnemonic = this.state.mnemonic
    console.log(mnemonic)
    if(!bip39.validateMnemonic(mnemonic)) {
      Alert.alert('请输入正确的助记词')
      return
    }
    let seed = bip39.mnemonicToSeed(mnemonic)
    console.log(seed)
    const root = HDKey.fromMasterSeed(seed)
    console.log(root)
    const masterPrivateKey = root.privateKey.toString('hex')
    console.log(masterPrivateKey)
    const addrNode = root.derive("m/44'/60'/0'/0/0")
    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    console.log(pubKey)
    const addr = ethUtil.publicToAddress(pubKey).toString('hex')
    console.log(addr)
    const address = ethUtil.toChecksumAddress(addr);
    console.log(address)
    AsyncStorage.multiSet([['mnemonic', mnemonic], ['account', address], ['mycoins', JSON.stringify(['ETH'])]])
    this.props.navigation.navigate('App')
  }

  render() {
    return (
      <View>
        <View style={{borderWidth:1,borderColor:'lightgrey',borderRadius:2,marginBottom:30,padding:10}}>
          <TextInput
            numberOfLines={4}
            multiline={true}
            value={this.state.mnemonic}
            placeholder='助记词，按空格分隔'
            onChangeText={(value)=>this._setMnemonic(value)}
          />
        </View>
        <Button title='导入' onPress={this._submit} />
      </View>
    )
  }
}
