import React, {Component} from 'react'
import {View, Text, AsyncStorage} from 'react-native'

var bip39 = require('bip39')
var HDKey = require('hdkey')
const ethUtil = require('ethereumjs-util')


export default class CreateWalletScreen extends Component {
  static navigationOptions = {
    title: '创建钱包'
  }

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this._createWallet()
  }

  _createWallet = () => {
    //this.setState({fetching:true})
    //console.log(this.state.password)
    //web3.eth.personal.newAccount(this.state.password).then((account)=>{
    //  console.log(account)
    //  this._storeAccount(account)
    //  this.props.navigation.navigate('App')
    //}).catch((error)=>Alert.alert(error.toString()))
    const mnemonic = bip39.generateMnemonic()
    console.log(mnemonic)
    const seed = bip39.mnemonicToSeed(mnemonic)
    const root = HDKey.fromMasterSeed(seed)
    const masterPrivateKey = root.privateKey.toString('hex')
    console.log(masterPrivateKey)
    const addrNode = root.derive("m/44'/60'/0'/0/0")
    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    console.log(pubKey)
    const addr = ethUtil.publicToAddress(pubKey).toString('hex')
    console.log(addr)
    const address = ethUtil.toChecksumAddress(addr);
    console.log(address)
    AsyncStorage.multiSet([['mnemonic', mnemonic], ['account', address]])
    this.props.navigation.navigate('App')
  }


  render() {
    return (
      <View>
        <Text>钱包创建中...</Text>
      </View>
    )
  }
}
