import React, {Component} from 'react'
import {AsyncStorage, StatusBar, StyleSheet, View, TextInput, Text, Button} from 'react-native'
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
      fetching: false
    }
  }

  componentDidMount() {
    this._getAccount()
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

  _renderButton = () => {
    if(!this.state.toValid || !this.state.valueValid) {
      console.log('valid error')
      return <Button title='下一步' color={colors.primary} disabled
        onPress={()=>null} />
    }else if (this.state.fetching) {
      return <Button title='处理中...' color={colors.primary} disabled
        onPress={()=>null} />
    }else {
      return <Button title='下一步' color={colors.primary}
        onPress={()=>this.props.navigation.navigate('Password')} />
    }
  }

  render() {
    return (
      <View style={{flex:1,padding:30}}>
        <StatusBar translucent={false} barStyle='dark-content' />
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
