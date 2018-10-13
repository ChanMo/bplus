import React, {Component} from 'react'
import {Alert, Modal, TouchableOpacity,ImageBackground, AsyncStorage, StatusBar, StyleSheet, View, TextInput, Text, Button} from 'react-native'
import colors from '../colors'

export default class TransferScreen extends Component {
  static navigationOptions = {
    title: '转账'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      balance: 0.00,
      to: null,
      value: '',
      toValid: false,
      valueValid: false,
      fetching: false,
      modalVisible: false,
      password: null,
      gasPrice: "0",
    }
  }

  componentDidMount() {
    web3.eth.getGasPrice().then((value)=>this.setState({gasPrice:value}))
    this._getAccount()
  }

  _onClose = () => {
    this.setState({modalVisible:false})
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account})
    this._getBalance()
  }

  _getBalance = () => {
    return web3.eth.getBalance(this.state.account)
      .then((res)=>web3.utils.fromWei(res, 'ether'))
      .then((balance)=>this.setState({balance:balance}))
      .catch((error)=>Alert.alert(error.toString()))
  }

  _setTo(value) {
    this.setState({to:value, toValid:true})
  }

  _setValue(value) {
    let valid = false
    if(value > 0 && value <= this.state.balance) {
      valid = true
    }
    this.setState({
      value: value,
      valueValid: valid
    })
  }

  _submit = () => {
    //web3.eth.personal.unlockAccount(this.state.account, this.state.password, 600).then(console.log).catch((error)=>Alert.alert(error.toString()))
    //return
    let data = {
      nonce: 1,
      from: this.state.account,
      gasPrice: this.state.gasPrice,
      gas: "21000",
      //to: this.state.to,
      to: "0xA32917f203089E11a4F8cff1535498BA3E3E7c86",
      value: web3.utils.toWei(this.state.value),
      data: ""
    }
    console.log(data)
    console.log(this.state.password)

    web3.eth.signTransaction(data, this.state.password)
      .then((res)=>web3.eth.sendSignedTransaction(res.raw).on('receipt', console.log))
      .catch((error)=>Alert.alert(error.toString()))
  }

  _renderButton = () => {
    if(!this.state.toValid || !this.state.valueValid) {
      console.log('valid error')
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
      //return <Button title='下一步' color={colors.primary}
      //  onPress={()=>this.props.navigation.navigate('Password')} />
      return <TouchableOpacity style={{margin:30,borderRadius:5,marginTop:80}} onPress={()=>this.setState({modalVisible:true})}>
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
              <Text style={{flex:3,olor:'#212b66',fontWeight:'100',textAlign:'right'}}>100,100xdc</Text>
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
            <Text style={{flex:1,lineHeight:30,textAlign:'right',color:'#808080'}}>0.00002324ether</Text>
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
