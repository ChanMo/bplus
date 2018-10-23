import React, {Component} from 'react'
import {DeviceEventEmitter, Alert, Modal, TouchableOpacity,ImageBackground, AsyncStorage, StatusBar, StyleSheet, View, TextInput, Text, Button,Slider} from 'react-native'

const ethTx = require('ethereumjs-tx')

export default class TransferScreen extends Component {
  static navigationOptions = {
    title: '转账'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null, // 账户地址
      balance: 0.00, // token资产
      to: null,
      toValid: false,
      value: '',
      valueValid: false,
      fetching: false,
      modalVisible: false,
      gasPrice: 0,
      sliderVal: 0 // 滑块value
    }
  }

  componentDidMount() {
    //this.addListenerOn(DeviceEventEmitter, 'check_password_pass', this._doTransaction)
    //this.addEventListener('check_password_pass', this._doTransaction)
    DeviceEventEmitter.addListener('transfer_pass_check',
      (e)=>this._doTransaction())
    web3.eth.getGasPrice().then((value)=>this.setState({gasPrice:value}))
    this._getAccount()
  }

  componentWillUnmount() {
    //this.removeEventListener('check_password_pass')
    //DeviceEventEmitter.removeListener()
  }

  _onClose = () => {
    this.setState({modalVisible:false})
  }

  // 获取账户
  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account})
    this._getBalance() //获取资产
  }

  // 获取资产
  _getBalance = () => {
    return web3.eth.getBalance(this.state.account)
      .then((res)=>web3.utils.fromWei(res, 'ether'))
      .then((balance)=>this.setState({balance:balance}))
      .catch((error)=>Alert.alert(error.toString()))
  }

  // 设置收款人地址
  _setTo(value) {
    this.setState({to:value, toValid:true})
  }

  // 设置转账金额
  _setValue(value) {
    let valid = true
    //let valid = false
    //if(value > 0 && value <= this.state.balance) {
    //  valid = true
    //}
    this.setState({
      value: value,
      valueValid: valid
    })
  }

  // 转账
  _doTransaction = async() => {
    //web3.eth.personal.unlockAccount(this.state.account, this.state.password, 600).then(console.log).catch((error)=>Alert.alert(error.toString()))
    //let value = `0x${web3.utils.toWei(this.state.value)}`
    let data = {
      nonce: 6,
      from: this.state.account,
      gasPrice: web3.utils.toHex(this.state.gasPrice),
      gasLimit: 60000,
      to: this.state.to,
      value: web3.utils.toHex(web3.utils.toWei(this.state.value, 'ether')),
      chainId: 1,
    }
    console.log(data)
    const tx = new ethTx(data)
    const privateKey = await AsyncStorage.getItem('privateKey') // 获取私钥
    tx.sign(Buffer.from(JSON.parse(privateKey))) // 签名
    const serializedTx = tx.serialize() // 序列化签名数据
    web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
      .on('transactionHash', function(hash) {
        console.log('hash', hash)
        Alert.alert(hash)
      })
      .on('receipt', function(receipt){
        console.log('receipt', receipt)
      })
      .on('confirmation', function(confirmationNumber, receipt) {
        console.log('confirmation', confirmationNumber)
      })
      .on('error', function(error) {
        Alert.alert(error.toString())
      })
  }

  // 设置gas value
  _slider = (value)=>{
    this.setState({
      sliderVal:value
    })
  }

  _renderButton = () => {
    if(!this.state.toValid || !this.state.valueValid) {
      //console.log('valid error')
      return <TouchableOpacity style={{margin:30,borderRadius:5,marginTop:80,backgroundColor:'#808080'}} disabled onPress={()=>null}>
              <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                  <Text style={{color:'#ffffff',alignSelf:'center'}}>下一步</Text>
              </View>
            </TouchableOpacity>
    }else if (this.state.fetching) {
      return <TouchableOpacity style={{margin:30,borderRadius:5,marginTop:80,backgroundColor:'#808080'}} disabled onPress={()=>null}>
              <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                  <Text style={{color:'#ffffff',alignSelf:'center'}}>处理中...</Text>
              </View>
            </TouchableOpacity>
    }else {
      return <TouchableOpacity style={{margin:30,borderRadius:5,marginTop:80}} onPress={()=>this.props.navigation.navigate('Password', {event:'transfer_pass_check'})}>
              <ImageBackground
                  style={{height:42}}
                  imageStyle={{height:42,alignItems:'center'}}
                  source={require('../images/wallet-btn.png')}>
                  <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                      <Text style={{color:'#ffffff',alignSelf:'center'}}>.下一步</Text>
                  </View>
              </ImageBackground>
            </TouchableOpacity>
    }
  }

  render() {
    return (
      <View style={{flex:1,padding:10}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        <Modal
          animationType="slide"
          transparent={true}
          style={{zIndex:9999}}
          visible={this.state.modalVisible}
          onRequestClose={()=>null}>
          <TouchableOpacity
            onPress={this._onClose}
            style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
          </TouchableOpacity>
          <View style={{padding:20,backgroundColor:'#fff'}}>
            <Text style={{textAlign:'center'}}>支付详情</Text>
            <View style={styles.modalBox}>
              <Text style={{flex:2,color:'#212b66',fontWeight:'bold'}}>密码</Text>
              <Text style={{flex:3,color:'#212b66',fontWeight:'100',textAlign:'right'}}>100,100xdc</Text>
            </View>
            <View style={styles.modalBox}>
              <Text style={styles.modalLeft}>订单信息:</Text>
              <Text style={styles.modalRight}>转账</Text>
            </View>
            <View style={styles.modalBox}>
              <Text style={styles.modalLeft}>收款地址:</Text>
              <Text style={styles.modalRight}>Udawdawjgrkawdkawdlkkaowdka</Text>
            </View>
            <View style={styles.modalBox}>
            <Text style={styles.modalLeft}>付款地址:</Text>
              <Text style={styles.modalRight}>Udawdawjgrkawdkawdlkkaowdka</Text>
            </View>
            <View style={styles.modalBox}>
            <Text style={styles.modalLeft}>旷工费用:</Text>
              <Text style={styles.modalRight}>Udawdawjgrkawdkawdlkkaowdka</Text>
            </View>
            <View style={styles.modalBox}>
              <Text style={styles.modalLeft}>交易号:</Text>
              <Text style={styles.modalRight}>Udawdawjgrkawdkawdlkkaowdka</Text>
            </View>

            <View style={{display:'flex',flexDirection:'row',height:44}}>
              <TouchableOpacity style={{flex:1,backgroundColor:'#b8b7b7',margin:5,marginTop:0,marginBottom:0,borderRadius:5,justifyContent:'center'}} onPress={this._onClose}>
                <Text style={{color:'#ffffff',alignSelf:'center'}}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:1,backgroundColor:'#ffb324',margin:5,marginTop:0,marginBottom:0,justifyContent:'center',borderRadius:5}}  onPress={this._submit}>
                <Text style={{color:'#ffffff',alignSelf:'center'}}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.form}>
          <View style={styles.formBox}>
            <Text style={styles.label}>收款人地址:</Text>
            <View style={styles.input}>
              <TextInput
                value={this.state.to}
                style={styles.textInput}
                placeholder='请输入收款人地址'
                onChangeText={(value)=>this._setTo(value)}
                height={30} />
            </View>
          </View>
          <View style={styles.formBox}>
            <Text style={styles.label}>转账数量:</Text>
            <View style={styles.input}>
              <TextInput height={30}
                value={this.state.value.toString()}
                placeholder='请输入转账数量'
                maxLength={10}
                onChangeText={(value)=>this._setValue(value)}
                keyboardType='decimal-pad' />
            </View>
          </View>
          {/* {!this.state.valueValid && */}
            {/* <Text style={{marginTop:-10,color:'red',marginBottom:10,fontSize:12}}>数量错误</Text>} */}
          <View style={styles.formBox}>
            <Text style={styles.label}>备注:</Text>
            <View style={styles.input}>
              <TextInput height={30} placeholder='请输入转账备注' />
            </View>
          </View>

          <View style={{display:'flex',flexDirection:'row',padding:10,paddingTop:5}}>
            <Text style={styles.label}>旷工费用:</Text>
            <Text style={{flex:1,lineHeight:30,textAlign:'right',color:'#808080'}}>{this.state.sliderVal}ether</Text>
          </View>
          <Slider value={this.state.sliderVal}
          onValueChange={(value)=>this._slider(value)}
          minimumValue={1}
          maximumValue={600000}
          step={1}></Slider>
          <View style={{display:'flex',flexDirection:'row',padding:5}}>
            <Text style={{textAlign:'left',flex:1,color:'#212b66'}}>慢</Text>
            <Text style={{textAlign:'right',flex:1,color:'#212b66'}}>快</Text>
          </View>
        </View>
        {this._renderButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 50,
  },
  formBox:{
    display:'flex',
    flexDirection:'row',
    backgroundColor:'#fff',
    padding:10,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:5,
    marginBottom:10
  },
  label: {
    fontWeight: 'bold',
    color:'#212b66',
    width:86,
    lineHeight:30
  },
  input: {
    flex:1,
    textAlign:'right',
    paddingLeft:5
  },
  modalBox:{
    display:'flex',
    flexDirection:'row',
    padding:10,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:5,
    marginBottom:10
    },
    modalLeft:{
      flex:2,
      fontSize:14,
      color:'#1c2562'
    },
    modalRight:{
      flex:3,
      textAlign:'right',
      color:'#27337d',
      fontSize:12
    }
})
