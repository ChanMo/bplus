import React, {Component} from 'react'
import {AsyncStorage, ToastAndroid, Clipboard,TouchableOpacity,Alert, StatusBar,TextInput, View, Text, Button} from 'react-native'
import QRCode from 'react-native-qrcode'
import colors from '../colors'

export default class ReceiptScreen extends Component {
  static navigationOptions = {
    title: '收款码'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null
    }
    this._getAccount()
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    console.log(account)
    this.setState({account:account})
  }

  _copyAddress = () => {
    Clipboard.setString(this.state.account)
    // ToastAndroid.show('复制成功', ToastAndroid.SHORT)
    Alert.alert('复制成功')
  }

  render() {
    if(!this.state.account) {
      return null
    }
    return (
      <View style={{flex:1,margin:10,marginBottom:70,borderRadius:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        <View style={{display:'flex',flexDirection:'row',width:'90%'}}>
          <Text style={{padding:5,flex:6,color:'#212b66',fontWeight:"bold"}}>收款金额:</Text>
          <TextInput
              placeholder='设置收款金额'
              multiline={true}
              blurOnSubmit={false}
              autoCapitalize='none'
              style={{width:180}}></TextInput>
          <Text style={{padding:5,flex:4,color:'#212b66'}}>ETH</Text>
        </View>
        <Text style={{marginBottom:20,marginTop:20,width:'90%',height:30,lineHeight:30,paddingLeft:10,paddingRight:10,overflow:"hidden",borderRadius:5,fontSize:12,color:'#fff',backgroundColor:colors.secondary}}>
          {this.state.account}
        </Text>
        <View style={{marginBottom:26,padding:15,backgroundColor:'white'}}>
          <QRCode
            size={280}
            value={this.state.account}
            bgColor='white'
            fgColor='black'
          />
        </View>
        <TouchableOpacity onPress={this._copyAddress} style={{borderWidth:.4,padding:10,backgroundColor:'#f9f9f9',fontSize:12}}>
          <Text style={{color:'rgb(78,78,78)'}}>复制收款地址</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
