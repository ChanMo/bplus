import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Text
} from 'react-native'

import Toast from 'react-native-simple-toast'
import bip39 from 'bip39'

export default class ImportSeedScreen extends Component {
  static navigationOptions = {
    title: '导入钱包',
    headerStyle:{
      borderBottomWidth:0,
      shadowOpacity:0,
      elevation:0,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      mnemonic: null
    }
  }

  /**
   * 提交
   */
  _submit(){
    let mnemonic = this.state.mnemonic
    // 验证助记词
    if(!bip39.validateMnemonic(mnemonic)) {
      Toast.show('请输入正确的助记词',1)
      return
    }
    this.props.navigation.navigate('SetPassword',{mnemonic})
  }

  /**
   * render input box
   */
  _renderInput = () => (
    <View style={styles.inputContainer}>
      <TextInput
        numberOfLines={4}
        placeholder='请输入助记词,按空格分隔'
        multiline={true}
        blurOnSubmit={false}
        autoCapitalize='none'
        value={this.state.mnemonic}
        onChangeText={(mnemonic)=>this.setState({mnemonic})}
        style={styles.input}></TextInput>
    </View>
  )

  /**
   * render button
   */
  _renderButton = () => (
    <TouchableOpacity
      style={{marginTop:100}}
      onPress={()=>this._submit()}>
      <ImageBackground
        style={styles.buttonBg}
        imageStyle={{height:42,alignItems:'center'}}
        source={require('../images/wallet-btn.png')}>
        <Text style={{fontSize:14,color:'#ffffff'}}>立即导入</Text>
      </ImageBackground>
    </TouchableOpacity>
  )

  render() {
    return (
      <View style={styles.container}>
        <View style={{paddingLeft:10,paddingRight:10}}>
          <Text style={styles.title}>
            请输入备份的钱包助记词(12个英文单词)</Text>
          {this._renderInput()}
          {this._renderButton()}
          <Text style={{textAlign:'center',fontWeight:'100'}}
            onPress={()=>{this.props.navigation.navigate('Web',{title:'帮助中心',link:api.word,path:'ImportSeed'})}}>什么是助记词?</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#F6f7fb'
  },
  title: {
    color:'#212b66',
    fontSize:16,
    fontWeight:'bold',
    paddingTop:20
  },
  inputContainer: {
    backgroundColor:'#fff',
    height:140,
    marginTop:30,
    borderRadius:5
  },
  input: {
    textAlignVertical: 'top',
    paddingLeft:20,
    paddingRight:20,
    marginTop:15,
    paddingBottom:15
  },
  buttonBg: {
    height:42,
    margin:30,
    marginBottom:15,
    alignItems:'center',
    justifyContent:'center'
  },
})
