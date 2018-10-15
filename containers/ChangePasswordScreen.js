import React, {Component} from 'react'
import {Alert, StyleSheet, AsyncStorage , TouchableOpacity, View, TextInput, Text, ImageBackground} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'

export default class PasswordScreen extends Component {
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
    const password = await AsyncStorage.getItem('password')
    this.setState({password: password})
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
          Alert.alert('密码错误')
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
        this.setState({
          input: '',
          changeTip:'确认新密码',
          passwordState:passwordState+1,
          newPassword:value
        })
        break;
        case 2:
          console.log(value,this.state.newPassword)
          if (value !== this.state.newPassword) {
            Alert.alert('两次密码不一致，请重新输入')
          }
          else{
            await AsyncStorage.setItem('password', value)
            Alert.alert('密码修改成功')
            this.props.navigation.navigate(this.state.to)
          }
        break;
      }
  }

  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'#f5f5f5',alignItems:'center',flexDirection:'row',elevation:3,marginTop:20,shadowColor:'grey',shadowOffset:{width:0,height:2,shadowOpacity:1,shadowRadius:1}}}>
      <View style={{flex:6.6,alignItems:'flex-start'}}>
        <Text style={{fontSize:16,color:'#212B66',fontWeight:'bold',paddingLeft:30}}>
          {this.state.changeTip}
        </Text>
      </View>
      <View style={{flex:1.7}}></View>
    </View>
  )

  _getFocus = () =>{
    var passw = this.refs.password;
    passw.focus()
  }

  render() {
    const {navigate, goBack} = this.props.navigation
    return (
      <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
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
            <View style={{display:'flex',flexDirection:'row'}}>
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
    lineHeight:50,
    fontSize:30,
    backgroundColor:'#ffffff'
  }

}
