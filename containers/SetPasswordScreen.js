import React, { Component } from 'react'
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Text,
  ActivityIndicator
} from 'react-native'
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast'
import bip39 from 'bip39'
import HDKey from 'hdkey'
import ethUtil from 'ethereumjs-util'
import { addAccount } from '../actions'

const six = [1,2,3,4,5,6]
const tips = [
  '密码用于保护私钥和交易授权',
  '币加不储存密码，也无法帮您找回，请务必牢记',
  '如果忘记密码，只能通过助记词导入重新设置密码'
]

const dismissKeyboard = require('dismissKeyboard');
class SetPasswordScreen extends Component {
  static navigationOptions = {
    title: '设置密码',
    headerStyle:{
      borderBottomWidth:0,
      shadowOpacity:0,
      elevation:0,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      password: '',
      changeTip:'请输入密码',
      passwordState:0,
      mnemonic: null,
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({
      mnemonic: this.props.navigation.getParam('mnemonic', null)
    })
  }

  componentWillUmount() {
    this.setState({loading: false})
  }

  /**
   * 输入密码
   */
  _setPassword(value) {
    this.setState({
      input: value,
    })
    if(value.length===6){
      this._submit(value,this.state.passwordState)
    }
  }

  /**
   * 提交
   */
  _submit = async(value,passwordState) => {
    switch(passwordState){
      case 0:
        this.setState({
          input: '',
          password: value,
          changeTip:'确认密码',
          passwordState:1
        })
        break;
      case 1:
        if(value != this.state.password){
          this.setState({
            input: ''
          })
          Toast.show('两次密码不一致，请重新输入',1)
          break;
        }

        this.setState({loading: true})
        const username = 'username'
        const password = this.state.password
        await Keychain.setGenericPassword(username,password)
        if(this.state.mnemonic) {
          // 导入钱包
          this._importAccount()
        } else {
          // 创建钱包
          this._createAccount()
        }
        break;
    }
  }

  /**
   * 创建钱包
   */
  _createAccount = async() => {
    const mnemonic = bip39.generateMnemonic()
    await this._mnemonicToAccount(mnemonic)
    this.setState({loading: false})
    this.props.navigation.navigate('Backups',{isFirst:true})
  }

  /**
   * 导入钱包
   */
  _importAccount = async() => {
    let mnemonic = this.state.mnemonic
    await this._mnemonicToAccount(mnemonic)
    this.setState({loading: false})
    this.props.navigation.navigate('App')
  }

  /**
   * mnemonic to account
   */
  _mnemonicToAccount = async(mnemonic) => {
    // 把助记词转换为种子
    let seed = bip39.mnemonicToSeed(mnemonic)
    // 通过种子生成root
    const root = HDKey.fromMasterSeed(seed)
    const masterPrivateKey = root.privateKey.toString('hex')
    const addrNode = root.derive("m/44'/60'/0'/0/0")
    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    const addr = ethUtil.publicToAddress(pubKey).toString('hex')
    const address = ethUtil.toChecksumAddress(addr);
    const _privateKey = Buffer.from(JSON.parse(JSON.stringify(addrNode._privateKey))).toString('hex')

    await AsyncStorage.multiSet([
      ['mnemonic', mnemonic],
      ['privateKey', _privateKey],
      ['account', address]
    ])
    this.props.addAccount(address)
    return
  }

  /**
   * 设置焦点
   */
  _getFocus = () =>{
    dismissKeyboard();
    var passw = this.refs.passwords;
    passw.focus()
  }


  /**
   * render header
   */
  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'#f6f7fb',alignItems:'center',flexDirection:'row',marginTop:40}}>
      <View style={{flex:6.6,alignItems:'flex-start'}}>
        <Text style={{fontSize:16,color:'#212B66',fontWeight:'bold',paddingLeft:30}}>
          {this.state.changeTip}
        </Text>
      </View>
      <View style={{flex:1.7}}></View>
    </View>
  )

  /**
   * render password input
   */
  _renderInput = () => (
    <View style={styles.input}>
      <TextInput
        value={this.state.input}
        keyboardType='numeric'
        ref='passwords'
        maxLength={6}
        autoFocus={true}
        onChangeText={(value)=>this._setPassword(value)}
        height={0}/>
      <View style={{alignContent:'center'}}>
        <View style={styles.inputContainer}>
          {six.map((item,index) => (
            <Text
              key={index}
              onPress={()=>{this._getFocus()}}
              style={styles.oneInput}>
              {this.state.input[index]?'*':''}</Text>
          ))}
        </View>
      </View>
    </View>
  )

  /**
   * render tips
   */
  _renderTips = () => (
    <View style={styles.tipContainer}>
      {tips.map((item,i) => (
        <View style={styles.tip} key={i}>
          <View style={styles.tipLeft}></View>
          <Text style={styles.tipRight}>{item}</Text>
        </View>
      ))}
    </View>
  )

  /**
   * render loading modal
   */
  _renderLoading = () => (
    <View style={styles.modal}>
      <ActivityIndicator></ActivityIndicator>
      <Text style={styles.modalText}>处理中...</Text>
    </View>
  )

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <View style={{flex:1,padding:20}}>
          {this._renderInput()}
          {this._renderTips()}
        </View>
        {this.state.loading && this._renderLoading()}
      </View>
    )
  }
}

const styles = {
  container: {
    flex:1,
    backgroundColor:'#f6f7fb'
  },
  modal: {
    position:'absolute',
    height:Dimensions.get('window').height-44,
    width:'100%',
    backgroundColor:'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent:'center'
  },
  modalText: {
    color:'#808080',
    marginTop:10
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputContainer: {
    display:'flex',
    flexDirection:'row',
    width:290,
    alignSelf:'center'
  },
  oneInput:{
    height:40,
    width:40,
    borderWidth:.5,
    borderColor:'#808080',
    margin:4,
    borderRadius:5,
    textAlign:'center',
    lineHeight:46,
    fontSize:30,
    backgroundColor:'#ffffff'
  },
  tipContainer: {
    padding: 5,
    marginTop: 10
  },
  tip:{
    display:'flex',
    flexDirection:'row',
    padding:2
  },
  tipLeft: {
    height:10,
    width:10,
    borderRadius:5,
    backgroundColor:'#212b66',
    margin:5,
  },
  tipRight: {
    flex:1,
    fontSize:13,
    color:'#808080',
    lineHeight:20
  }

}

const mapDispatchToProps = dispatch => {
  return {
    addAccount: (account) => dispatch(addAccount(account))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SetPasswordScreen)
