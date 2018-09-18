import React, {Component} from 'react'
import {AsyncStorage, TouchableOpacity, View, TextInput, Text, Button} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'

export default class PasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: null,
      fetching: false,
    }
  }

  _importWallet = async () => {
    this.setState({fetching:true})
    try {
      let wallet = '0x01c310737e568f590287cee6ffa729ee937ebe4c'
      await AsyncStorage.setItem('wallet', wallet)
      this.props.navigation.navigate('App')
    } catch(error) {
      console.log('error', error)
    }
  }

  render() {
    const {navigate, goBack} = this.props.navigation
    return (
      <View style={{flex:1}}>
        <View style={{height:56,backgroundColor:'white',alignItems:'center',flexDirection:'row',elevation:3}}>
          <TouchableOpacity
            style={{flex:1.7,paddingLeft:15}}
            onPress={()=>goBack()}>
            <Icon name='x' size={22} color='black' />
          </TouchableOpacity>
          <View style={{flex:6.6,alignItems:'flex-start'}}>
            <Text style={{fontSize:20,color:'black',fontWeight:'bold'}}>
              输入密码</Text>
          </View>
          <View style={{flex:1.7}}></View>
        </View>
        <View style={{flex:1,padding:30}}>
          <Text style={{fontWeight:'bold',marginBottom:15}}>输入密码</Text>
          <View style={{borderWidth:1,borderColor:colors.lightgrey,borderRadius:2,marginBottom:30}}>
            <TextInput
              keyboardType='number-pad'
              onChangeText={(value)=>this.setState({password:value})}
              value={this.state.password} />
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
