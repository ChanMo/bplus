import React,{Component} from 'react'
import {AsyncStorage, Alert, View, TextInput,TouchableOpacity,ImageBackground, Button, Text} from 'react-native'
import api from '../api'

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
    this.props.navigation.navigate('SetPassword',{to:'App'})
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f7f6fc',paddingLeft:10,paddingRight:10}}>
        <Text style={{color:'#212b66',fontSize:16,fontWeight:'bold',paddingTop:20}}>请输入备份的钱包助记词(12个英文单词)</Text>
        <View style={{backgroundColor:'#fff',height:140,marginTop:30,borderRadius:5}}>
            <TextInput
              numberOfLines={4}
              placeholder='请输入助记词,按空格分隔'
              multiline={true}
              blurOnSubmit={false}
              autoCapitalize='none'
              value={this.state.mnemonic}
              onChangeText={(value)=>this._setMnemonic(value)}
              style={{height:100,padding:20,paddingTop:20,paddingBottom:20}}></TextInput>
        </View>
        <TouchableOpacity style={{marginTop:100}} onPress={this._submit}>
            <ImageBackground
                style={{height:42,margin:30,marginBottom:15}}
                imageStyle={{height:42,alignItems:'center'}}
                source={require('../images/wallet-btn.png')}>
                <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                    <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>立即导入</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
        <Text style={{textAlign:'center',fontWeight:'100'}}
          onPress={()=>{this.props.navigation.navigate('Web',{title:'帮助中心',link:api.word})}}>什么是助记词?</Text>
      </View>
    )
  }
}
