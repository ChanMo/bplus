import React, {Component} from 'react'
import {DeviceEventEmitter, Alert, StyleSheet, AsyncStorage , TouchableOpacity, View, TextInput, Text, ImageBackground} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'
import * as Keychain from 'react-native-keychain';
const dismissKeyboard = require('dismissKeyboard'); 
import Toast from 'react-native-simple-toast'

export default class PasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: null,
      input: '',
      valid: false,
      fetching: false
    }
  }

  componentDidMount() {
    this._getPassword()

    DeviceEventEmitter.addListener('back_ups',
      (e)=>this.props.navigation.navigate('Backups'))
    DeviceEventEmitter.addListener('derived_key',
      (e)=>this.props.navigation.navigate('DerivedKey'))
    DeviceEventEmitter.addListener('delet_hint',
      (e)=>this.props.navigation.navigate('DelectHint'))
  }

  _getPassword = async() => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.setState({password: credentials.password})
      } else {
        console.log('No credentials stored')
      }
    } catch (error) {
      console.log('Keychain couldn\'t be accessed!', error);
    }
  }

  _setPassword(value) {
    this.setState({
      input: value
    })
    if(value.length===6){
      this._submit(value)
    }
  }

  _submit= (value) => {
    if (value !== this.state.password) {
      this.setState({
        input: ''
      })
      Toast.show('密码错误',1)
    } else {
      DeviceEventEmitter.emit(this.props.navigation.getParam('event'))
      this.props.navigation.goBack()
    }
  }

  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'#f6f7fb',alignItems:'center',flexDirection:'row',marginTop:40}}>
      <TouchableOpacity
        style={{flex:1.7,paddingLeft:15}}
        onPress={()=>this.props.navigation.goBack()}>
        <Icon name='x' size={22} color='black' />
      </TouchableOpacity>
      <View style={{flex:6.6,alignItems:'flex-start'}}>
        <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>
          输入密码</Text>
      </View>
      <View style={{flex:1.7}}></View>
    </View>
  )

  _getFocus = () =>{
    dismissKeyboard();
    var passw = this.refs.password;
    passw.focus()
  }

  render() {
    const {navigate, goBack} = this.props.navigation
    return (
      <View style={{flex:1,backgroundColor:'#f6f7fb'}}>
        {this._renderHeader()}
        <View style={{flex:1,padding:30}}>
          {/* <Text style={styles.label}>密码</Text> */}
          <View style={styles.input}>
            <TextInput
              value={this.state.input}
              keyboardType='numeric'
              ref='password'
              maxLength={6}
              autoFocus={true}
              onChangeText={(value)=>this._setPassword(value)}
              height={0}/>
            <View style={{alignContent:'center'}}>
              <View style={{display:'flex',flexDirection:'row',width:290,alignSelf:'center'}}>
                <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[0]?'*':''}</Text>
                <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[1]?'*':''}</Text>
                <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[2]?'*':''}</Text>
                <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[3]?'*':''}</Text>
                <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[4]?'*':''}</Text>
                <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[5]?'*':''}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    // borderWidth: 1,
    // borderColor: colors.lightgrey,
    // borderRadius: 5,
    // marginBottom: 15,
    // paddingHorizontal:10,
  },
  oneInput:{
    flex:1,
    height:40,
    width:40,
    borderWidth:.5,
    borderColor:'#808080',
    margin:4,
    borderRadius:5,
    textAlign:'center',
    lineHeight:46,
    fontSize:30,
    backgroundColor:'#ffffff'
  }

}
