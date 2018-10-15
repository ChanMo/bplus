import React, {Component} from 'react'
import {DeviceEventEmitter, Alert, StyleSheet, AsyncStorage , TouchableOpacity, View, TextInput, Text, ImageBackground} from 'react-native'
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
      to: null
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
      this._submit(value)
    }
  }

  _submit= (value) => {
    if (value !== this.state.password) {
      Alert.alert('密码错误')
    } else {
      DeviceEventEmitter.emit('check_password_pass')
      this.props.navigation.goBack()
    }
  }

  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'#f5f5f5',alignItems:'center',flexDirection:'row',elevation:3,marginTop:20,shadowColor:'grey',shadowOffset:{width:0,height:2,shadowOpacity:1,shadowRadius:1}}}>
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
    var passw = this.refs.password;
    passw.focus()
  }

  render() {
    const {navigate, goBack} = this.props.navigation
    return (
      <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
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
            <View style={{display:'flex',flexDirection:'row'}}>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[0]}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[1]}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[2]}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[3]}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[4]}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[5]}</Text>
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
    lineHeight:40,
    fontSize:20,
    backgroundColor:'#ffffff'
  }

}
