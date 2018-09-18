import React, {Component} from 'react'
import {AsyncStorage, ToastAndroid, Clipboard, StatusBar, View, Text, Button} from 'react-native'
import QRCode from 'react-native-qrcode'
import colors from '../colors'

export default class ReceiptScreen extends Component {
  static navigationOptions = {
    title: '收款'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null
    }
    this._getAccount()
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('wallet')
    this.setState({account:account})
  }

  _copyAddress = () => {
    Clipboard.setString(this.state.account)
    ToastAndroid.show('复制成功', ToastAndroid.SHORT)
  }

  render() {
    if(!this.state.account) {
      return null
    }
    return (
      <View style={{flex:1,padding:30,alignItems:'center',justifyContent:'center'}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        <View style={{marginBottom:30,padding:15,backgroundColor:'white'}}>
          <QRCode
            size={200}
            value={this.state.account}
            bgColor='white'
            fgColor='black'
          />
        </View>
        <Text style={{marginBottom:20,fontSize:18,color:colors.secondary}}>
          {this.state.account}</Text>
        <Button
          onPress={this._copyAddress}
          color={colors.primary}
          title='复制收款地址' />
      </View>
    )
  }
}
