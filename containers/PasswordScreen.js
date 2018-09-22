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

  _renderHeader = () => (
    <View style={{height:44,backgroundColor:'white',alignItems:'center',flexDirection:'row',elevation:3,marginTop:20}}>
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
      return <Button title='确定' />
    }
  }

  render() {
    const {navigate, goBack} = this.props.navigation
    return (
      <View style={{flex:1}}>
        {this._renderHeader()}
        <View style={{flex:1,padding:30}}>
          <Text style={styles.label}>密码</Text>
          <View style={styles.input}>
            <TextInput
              value={this.state.password}
              onChangeText={(value)=>this._setPassword(value)}
              height={40} />
          </View>
          {this.state.fetching ? (
            <Button
              title='验证中...'
              color={colors.primary}
              disabled
              onPress={()=>null} />
          ) : (
            <Button
              onPress={this._importWallet}
              title='确定'
              color={colors.primary}  />
          )}
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
