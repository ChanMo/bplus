import React, {Component} from 'react'
import {Alert, StyleSheet, AsyncStorage, TouchableOpacity, View, TextInput, Text, Button} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'

export default class PasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: null,
      password: null,
      valid: false,
      fetching: false,
    }
  }

  componentDidMount() {
    this._getAccount()
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account: account})
  }

  _setPassword(value) {
    let valid = false
    if(value.length > 6) {
      valid = true
    }
    this.setState({
      password: value,
      valid: valid
    })
  }

  _checkPassword = () => {
    let password = this.state.password
  }

  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'white',alignItems:'center',flexDirection:'row',elevation:3,marginTop:20,shadowColor:'grey',shadowOffset:{width:0,height:2,shadowOpacity:1,shadowRadius:1}}}>
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

  _renderButton = () => {
    if(!this.state.valid) {
      return <Button title='确定' disabled onPress={()=>null} />
    } else {
      return <Button title='确定' onPress={this._checkPassword}/>
    }
  }

  render() {
    const {navigate, goBack} = this.props.navigation
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._renderHeader()}
        <View style={{flex:1,padding:30}}>
          <Text style={styles.label}>密码</Text>
          <View style={styles.input}>
            <TextInput
              value={this.state.password}
              onChangeText={(value)=>this._setPassword(value)}
              height={40} />
          </View>
          {this._renderButton()}
        </View>
      </View>
    )
  }
}

const styles = {
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

}
