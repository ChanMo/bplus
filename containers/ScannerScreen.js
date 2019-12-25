import React, {Component} from 'react'
import {DeviceEventEmitter,View,Text,Alert, Dimensions,Platform} from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
const {height} = Dimensions.get('window')
import Toast from 'react-native-simple-toast'
import IphoneX from './../reducers/isIphoneX'
import Icon from 'react-native-vector-icons/Feather'

export default class ScannerScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.navigation.getParam('type', 'account'),
      result: null
    }
  }

  /**
   * 扫描成功
   */
  onSuccess(e) {
    if(this.state.type == 'url') {
      DeviceEventEmitter.emit('scanner_url_success', e.data)
      this.props.navigation.goBack()
      return
    }
    e = e.data.toString()
    let start = e.indexOf(":")
    let mark = e.indexOf("?")
    let leftVal='',
        rightVal = ''
    leftVal = e.substring(start,0)
    rightVal = e.substring(start+43,start+1)

    if(e.length==42&&web3.utils.isAddress(e)){
      DeviceEventEmitter.emit('scanner_success', e)
    }
    else if(leftVal=='ethereum'){
      DeviceEventEmitter.emit('scanner_success', rightVal)
    }
    else if(leftVal=='iban'){
      DeviceEventEmitter.emit('scanner_success', rightVal)
    }
    else{
      Toast.show('请扫描正确的二维码',1)
      this.props.navigation.goBack()
    }
  }

  render() {
    return (
      <View style={{flex:1,display:'flex'}}>
        <View style={{height:44,width:'100%',backgroundColor:'#fff',position:'relative',
              ...IphoneX.ifIphoneX({
                marginTop: 44
              }, {
                marginTop: Platform.OS === 'ios' ? 20 : 0,
              })}}>
            <Text style={{height:44,width:88,padding:7,position:'absolute',zIndex:1}} onPress={()=>this.props.navigation.goBack()}>
              <Icon  name='chevron-left' size={30} color='#666666'></Icon>
            </Text>
          <Text style={{height:44,width:'100%',textAlign:'center',position:'absolute',fontSize:16,lineHeight:44}}>扫码</Text>
          </View>
        <QRCodeScanner
          showMarker={true}
          onRead={this.onSuccess.bind(this)}
          cameraStyle={{height:height-44}}>
        </QRCodeScanner>
      </View>

    )
  }
}
