import React, {Component} from 'react'
import {Alert, Modal, TouchableOpacity, AsyncStorage, StatusBar, StyleSheet, View, TextInput, Text, Button} from 'react-native'
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
      value: 0,
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
      return <Button title='下一步' color={colors.primary} disabled
        onPress={()=>null} />
    }else if (this.state.fetching) {
      return <Button title='处理中...' color={colors.primary} disabled
        onPress={()=>null} />
    }else {
      //return <Button title='下一步' color={colors.primary}
      //  onPress={()=>this.props.navigation.navigate('Password')} />
      return <Button title='下一步' color={colors.primary}
        onPress={()=>this.setState({modalVisible:true})} />
    }
  }

  render() {
    return (
      <View style={{flex:1,padding:30}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={()=>null}>
          <TouchableOpacity
            onPress={this._onClose}
            style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
          </TouchableOpacity>
          <View style={{padding:20}}>
            <Text style={styles.label}>密码</Text>
            <View style={styles.input}>
              <TextInput
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(value)=>this.setState({password:value})}
                height={40} />
            </View>
            <Button title='确定' onPress={this._submit} />
          </View>
        </Modal>
        <View style={styles.form}>
          <Text style={styles.label}>钱包地址</Text>
          <View style={styles.input}>
            <TextInput
              value={this.state.to}
              onChangeText={(value)=>this._setTo(value)}
              height={40} />
          </View>
          <Text style={styles.label}>转账数量({this.state.balance})</Text>
          <View style={styles.input}>
            <TextInput height={40}
              value={this.state.value.toString()}
              onChangeText={(value)=>this._setValue(value)}
              keyboardType='decimal-pad' />
          </View>
          {!this.state.valueValid &&
          <Text style={{marginTop:-10,color:'red',marginBottom:10,fontSize:12}}>数量错误</Text>}
          <Text style={styles.label}>备注</Text>
          <View style={styles.input}>
            <TextInput height={40} />
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
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightgrey,
    borderRadius: 2,
    marginBottom: 15,
    paddingHorizontal:10,
  }
})
