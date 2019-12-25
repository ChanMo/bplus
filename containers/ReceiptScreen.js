import React, {Component} from 'react'
import {Share, Image, AsyncStorage, ToastAndroid,ScrollView,ImageBackground, Clipboard,TouchableOpacity,Alert,TextInput, View, Text, Button} from 'react-native'
import { connect } from 'react-redux'
import Identicon from 'identicon.js'
import QRCode from 'react-native-qrcode'
import colors from '../colors'
import Toast from 'react-native-simple-toast'

class ReceiptScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '收款码',
      headerStyle:{
          borderBottomWidth:0,
          shadowOpacity:0,
          elevation:0,
      },
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam('share')}>
          <Text style={{marginRight:15,color:'#000'}}>分享</Text>
        </TouchableOpacity>
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({share: this.onShare})
  }

  onShare = () => {
    Share.share({
      message:this.props.account,
      title:'币加'
    })
  }

  _copyAddress = () => {
    Clipboard.setString(this.props.account)
    // ToastAndroid.show('复制成功', ToastAndroid.SHORT)
    Toast.show('复制成功',1)
  }

  render() {
    let image = new Identicon(this.props.account, {size:420,background: [255, 255, 255]}).toString()
    return (
      <ImageBackground source={require('./../images/wallet-bg.png')}
        style={{width: '100%', height: '100%',backgroundColor:'#f6f7fb'}}
        imageStyle={{width:'100%',height:260,marginTop:-40}}>
        <ScrollView style={{flex:1}}>
          <View style={{flex:1,width:'92%',minHeight:600,marginTop:30,marginBottom:30,borderRadius:5,backgroundColor:'#fff',alignItems:'center',alignSelf:'center',justifyContent:'center'}}>
            <View style={{height:64,width:64,borderRadius:32,marginBottom:40,borderWidth:1,borderColor:'#f0f0f0',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
              <Image
                source={{uri:'data:image/png;base64,'+image}}
                style={{width:46,height:46,alignSelf:'center',borderRadius:5}} />
            </View>
            <View style={{marginBottom:22,padding:15,backgroundColor:'#f9f9f9',borderRadius:5}}>
              <QRCode
                size={260}
                value={this.props.account}
                bgColor='black'
                fgColor='#f9f9f9'
              />
            </View>
            <Text style={{marginBottom:20,marginTop:10,width:'90%',padding:10,paddingLeft:3,paddingRight:3,overflow:"hidden",borderRadius:5,textAlign:'center',fontSize:12,color:'#fff',backgroundColor:colors.secondary}}>
              {this.props.account}
            </Text>
            <TouchableOpacity onPress={this._copyAddress} style={{borderWidth:.4,padding:10,backgroundColor:'#f9f9f9',fontSize:12}}>
              <Text style={{color:'rgb(78,78,78)'}}>复制收款地址</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: state.account.address
  }
}

export default connect(mapStateToProps)(ReceiptScreen)
