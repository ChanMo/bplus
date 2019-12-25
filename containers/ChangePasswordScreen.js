import React, {Component} from 'react'
import {DeviceEventEmitter, View, TextInput, Text} from 'react-native'
import * as Keychain from 'react-native-keychain';
const dismissKeyboard = require('dismissKeyboard'); 
import Toast from 'react-native-simple-toast'

export default class PasswordScreen extends Component {
  static navigationOptions = {
    title: '钱包工具',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      password: null,
      input: '',
      valid: false,
      fetching: false,
      to: null,
      changeTip:'请输入密码',
      passwordState:0,
      newPassword:null
    }
  }

  componentDidMount() {
    let to = this.props.navigation.getParam('to')
    this.setState({to:to})
    this._getPassword()
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
      this._submit(value,this.state.passwordState)
    }
  }

  _submit= async (value,passwordState) => {
      switch(passwordState){
        case 0:
        if (value !== this.state.password) {
          this.setState({
            input: '',
          })
          Toast.show('密码错误',1)
        }
        else{
          this.setState({
            input: '',
            changeTip:'请输入新密码',
            passwordState:passwordState+1
          })
        }
        break;
        case 1:
        if (value == this.state.password) {
          this.setState({
            input: '',
          })
          Toast.show('新旧密码相同，请修改新密码',1)
        }
        else{
          this.setState({
            input: '',
            changeTip:'确认新密码',
            passwordState:passwordState+1,
            newPassword:value
          })
        }
        break;
        case 2:
          if (value !== this.state.newPassword) {
            this.setState({
              input: '',
            })
            Toast.show('两次密码不一致，请重新输入',1)
          }
          else{
            await Keychain.resetGenericPassword()
            const username = 'username'
            const password = this.state.newPassword
            await Keychain.setGenericPassword(username,password)
            Toast.show('密码修改成功',1)
            DeviceEventEmitter.emit('check_password_pass')
            this.props.navigation.goBack()
          }
        break;
      }
  }

  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'#f6f7fb',alignItems:'center',flexDirection:'row',marginTop:20}}>
      <View style={{flex:6.6,alignItems:'flex-start'}}>
        <Text style={{fontSize:16,color:'#212B66',fontWeight:'bold',paddingLeft:30}}>
          {this.state.changeTip}
        </Text>
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
