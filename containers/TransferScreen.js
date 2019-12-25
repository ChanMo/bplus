import React, {Component} from 'react'
import {
  Alert,
  DeviceEventEmitter,
  Modal,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  RefreshControl,
  Text } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux'
import {
  fetchBalance,
  sendTransaction,
  checkPending
} from '../actions'
const ethTx = require('ethereumjs-tx')

import tokens from '../tokens'
import Toast from 'react-native-simple-toast'

const FEE_CHOICES = {
  'normal': '普通',
  'fast': '快速'
}

class TransferScreen extends Component {
  static navigationOptions = {
    title: '转账',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      balance: 0.0000,
      token: props.navigation.getParam('token', 'ETH'),
      to: props.navigation.getParam('to', null), // 目标地址
      value: 0, // 转出数量
      gasPrice: 0.00, // gas price
      fee: 0, // 最高手续费
      refreshing: false,
      unlock: false, // 是否解锁

      modalVisible: false,
      feeType: 'normal',

      poundageState: 0,
      poundageName: '普通',
      selectPoundage:false,
      isAll: false,

      disabled: false,
    }
  }

  componentDidMount() {
    this.props.checkPending(this.props.pending)
    // 监听密码
    DeviceEventEmitter.addListener('transfer_pass_check',
      (e)=>this.setState({unlock: true}))

    // 监听扫码
    DeviceEventEmitter.addListener('scanner_success', (e)=>{
      this.setState({to: e})
    })

    web3.eth.getGasPrice().then(gasPrice=>{
      this.setState({gasPrice})
      return gasPrice
    }).then(gasPrice=>this.setState({fee: this.makeFee(gasPrice)}))

    this.props.fetchBalance(this.props.account, this.state.token)

    this.setState({eth: this.props.tokens.filter(item=>item.token == 'ETH')[0].balance})
    let token = this.props.tokens.filter(item => item.token == this.state.token)[0]
    if(token)
      this.setState({balance: token.balance})
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.unlock !== this.state.unlock
      && this.state.unlock == true) {
      this._doTransaction()
    }
  }

  /**
   * on scanner
   */
  onScanner = () =>{
    this.props.navigation.navigate('Scanner')
  }

  /**
   * set fee type
   */
  onSetType = (type) => {
    this.setState({
      feeType: type,
      fee: this.makeFee(this.state.gasPrice, type)
    })
    this.onToggleModal()
  }

  /**
   * get submit nonce
   */
  getSubmitNonce = async() => {
    return web3.eth.getTransactionCount(this.props.account).then(res=>res)
  }

  /**
   * get to address
   */
  getSubmitTo = () => {
    let to = this.state.to
    if(this.state.token !== 'ETH') {
      let tokenData = tokens[this.state.token]
      let contract = new web3.eth.Contract(
        JSON.parse(tokenData.abi),
        tokenData.address);
      to = tokenData.address
    }
    return to
  }

  /**
   * get contract data
   */
  getSubmitData = () => {
    if(this.state.token == 'ETH') {
      return web3.utils.toHex('')
    }
    let tokenData = tokens[this.state.token]
    let contract = new web3.eth.Contract(
      JSON.parse(tokenData.abi),
      tokenData.address)
    let value = web3.utils.toHex(web3.utils.toWei(this.state.value))
    return contract.methods.transfer(this.state.to, value).encodeABI()
  }

  /**
   * get submit value
   */
  getSubmitValue = () => {
    let value = web3.utils.toHex(0)
    if(this.state.token == 'ETH') {
      value = web3.utils.toHex(web3.utils.toWei(this.state.value))
    }
    return value
  }

  /**
   * 签名
   */
  signData = async(data) => {
    let tx = new ethTx(data)
    let privateKey = await AsyncStorage.getItem('privateKey')
    console.log(privateKey)
    privateKey = Buffer.from(privateKey, 'hex')
    tx.sign(privateKey) // 签名
    const serializedTx = tx.serialize() // 序列化签名数据
    return `0x${serializedTx.toString('hex')}`
  }

  // 转账
  _doTransaction = async() => {
    console.log('doTransaction')
    this.setState({
      disabled: true,
      unlock: false,
    })
    const nonce = await this.getSubmitNonce()
    let data = {
      nonce: web3.utils.toHex(nonce),
      from: this.props.account,
      gasPrice: web3.utils.toHex(this.state.gasPrice),
      gasLimit: web3.utils.toHex(60000),
      to: this.getSubmitTo(),
      value: this.getSubmitValue(),
      data: this.getSubmitData(),
      chainId: 1,
    }
    data = await this.signData(data)

    this.props.sendTransaction({
      token: this.state.token,
      from: this.props.account,
      to: this.state.to,
      value: this.state.value,
      signData: data
    })

    Alert.alert('转帐已提交', null, [
      {text: '确定', onPress:()=>this.props.navigation.goBack()},
      {cancelable: false}
    ])
  }

  /**
   * 验证
   */
  _validation = () =>{
    console.log('peding', this.props.pending)
      //表单验证
      //1.收款人地址为空或长度不正确
      //2.转账地址不能与收款地址相同
      //3.转账输入金额+手续费不能大于余额
      //4.eth余额不够提供转账手续费
      let balance = this.state.balance
      let min = this.state.fee
      if(this.state.token == 'ETH') {
        min += this.state.value
      }
      if(this.state.to==''){
        Toast.show('请输入收款地址',1)
        return
      }
      else if(this.state.to-this.props.account==0){
        Toast.show('收款地址不能与转账地址相同',1)
        return
      }
      else if(!web3.utils.isAddress(this.state.to)){
        Toast.show('请输入正确的收款地址',1)
        return
      }
      else if(parseFloat(min)>balance){
        Toast.show('余额不足',1)
        return
      }
      else if(this.props.eth < min){
        Toast.show('手续费不足',1)
        return
      } else if(this.props.pending.length > 0) {
        Toast.show('请等待上一笔交易区块确认完成，避免双重攻击')
        return
      }
      this.props.navigation.navigate('Password', {event:'transfer_pass_check'})
  }

  /**
   * render submit button
   */
  _renderButton = () => (
    <TouchableOpacity
      disabled={this.state.disabled}
      style={styles.buttonContainer}
      onPress={this._validation}>
      <ImageBackground
        style={{height:42,alignItems:'center',justifyContent:'center'}}
        imageStyle={{height:42,alignItems:'center'}}
        source={require('../images/wallet-btn.png')}>
        <Text style={{color:'#ffffff'}}>下一步</Text>
        </ImageBackground>
      </TouchableOpacity>
  )

  /**
   * render modal bg
   */
  _renderModalBg = () => (
    <TouchableOpacity
      onPress={this.onToggleModal}
      style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
    </TouchableOpacity>
  )

  /**
   * render fee choose modal
   */
  _renderModal = () => {
    return(
      <Modal
        nimationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={()=>null}>
        {this._renderModalBg()}
        <View style={{backgroundColor:'#fff',padding:20}}>
          <Text style={{textAlign:'center'}}>选择手续费</Text>
          <TouchableOpacity
            style={styles.selectItem}
            onPress={()=>this.onSetType('normal')}>
            <Text style={{fontSize:16}}>普通</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectItem, {marginTop:1}]}
            onPress={()=>this.onSetType('fast')}>
            <Text style={{fontSize:16}}>快速</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  /**
   * render account info
   */
  _renderInfo = () => {
    let balance = parseFloat(this.state.balance).toFixed(4)
    return (
      <View style={styles.infoContainer}>
        <Text style={{color:"#333333"}}>余额:
          <Text style={{color:"#f1a94f"}}>
            {balance}{this.state.token}
          </Text>
        </Text>
        {/**<Text onPress={()=>{this._setValueMax()}} style={{flex:1,textAlign:'right',fontWeight:'bold',color:"#1c2562"}}>全部转出</Text>**/}
      </View>

    )
  }

  /**
   * render to input
   */
  _renderInputTo = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>收款人地址:</Text>
      <View style={styles.input}>
        <TextInput
          value={this.state.to}
          height={40}
          placeholder='请输入收款人地址'
          onChangeText={(to)=>this.setState({to})} />
      </View>
      <TouchableOpacity
        style={{height:20,width:20,marginTop:10}}
        onPress={this.onScanner} >
        <Icon name='maximize' size={20} color='#808080' />
      </TouchableOpacity>
    </View>
  )

  /**
   * render input value
   */
  _renderInputValue = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>转账数量:</Text>
      <View style={styles.input}>
        <TextInput
          value={this.state.value.toString()}
          placeholder='请输入转账数量'
          height={40}
          maxLength={10}
          onChangeText={(value)=>this.setState({value})}
          keyboardType='decimal-pad' />
      </View>
    </View>
  )

  /**
   * toggle fee choose  modal
   */
  onToggleModal = () => {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  /**
   * make fee
   */
  makeFee = (gasPrice, feeType='normal', gasLimit=60000) => {
    let fee = gasPrice * gasLimit
    if(feeType == 'fast') {
      fee = fee * 10
    }
    console.log(fee)
    return web3.utils.fromWei(fee.toString())
  }

  /**
   * render input fee
   */
  _renderInputFee = () => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>手续费:</Text>
        <View style={styles.input}>
          <TextInput
            editable={false}
            value={this.state.fee.toString()}
            height={40} />
        </View>
        <TouchableOpacity
          onPress={this.onToggleModal} >
          <Text style={styles.feeLabel}>
            {FEE_CHOICES[this.state.feeType]}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * render form
   */
  _renderForm = () => (
    <View style={styles.form}>
      {this._renderInputTo()}
      {this._renderInputValue()}
      {this._renderInputFee()}
    </View>
  )

  /**
   * 刷新
   */
  _onRefresh = () => {
    this.setState({refreching:true})
    this.props.checkPending(this.props.pending)
    web3.eth.getGasPrice().then(gasPrice=>{
      this.setState({gasPrice})
      return gasPrice
    }).then(gasPrice=>this.setState({fee: this.makeFee(gasPrice)}))

    this.props.fetchBalance(this.props.account, this.state.token)

    this.setState({eth: this.props.tokens.filter(item=>item.token == 'ETH')[0].balance})
    let token = this.props.tokens.filter(item => item.token == this.state.token)[0]
    if(token)
      this.setState({balance: token.balance})
    this.setState({refreshing: false})
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {this._renderInfo()}
        {this._renderForm()}
        {this._renderButton()}
        {this._renderModal()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:10,
    backgroundColor:'#f6f7fb'
  },
  form: {
    marginBottom: 50,
  },
  infoContainer: {
    marginTop: 5,
    flexDirection:'row',
    height:30,
    paddingHorizontal:10,
    justifyContent: 'space-between'
  },
  inputGroup:{
    display:'flex',
    flexDirection:'row',
    backgroundColor:'#fff',
    borderRadius:5,
    marginBottom:10,
    height:40,
    paddingLeft:10,
    paddingRight:10
  },
  label: {
    fontWeight: 'bold',
    color:'#212b66',
    width:86,
    lineHeight:40
  },
  input: {
    flex:1,
    textAlign:'right',
    paddingLeft:5,
    height:40,
  },
  feeLabel:{
    fontSize:14,
    fontWeight:"700",
    height:40,
    lineHeight:40,
    color:'#1c2562'
  },
  buttonContainer: {
    margin:30,
    borderRadius:5,
    marginTop:80
  },
  selectItem: {
    backgroundColor:'#f5f5f5',
    marginTop:10,
    padding:14,
    borderRadius:4
  }
})

const mapStateToProps = state => {
  return {
    account: state.account.address,
    tokens: state.tokens,
    pending: state.pending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkPending: (data) => dispatch(checkPending(data)),
    fetchBalance: (address, token) => dispatch(fetchBalance(address, token)),
    sendTransaction: (data) => dispatch(sendTransaction(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(TransferScreen)
