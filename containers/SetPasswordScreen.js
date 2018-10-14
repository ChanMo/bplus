import React, {Component} from 'react'
import {Alert, AsyncStorage, View, TextInput, Text, Button} from 'react-native'

export default class SetPasswordScreen extends Component {
  static navigationOptions = {
    title: '设置密码'
  }

  constructor(props) {
    super(props)
    this.state = {
      to: null,
      password: null
    }
  }

  componentDidMount() {
    const to = this.props.navigation.getParam('to')
    this.setState({to:to})
  }

  _setPassword(value) {
    this.setState({
      password: value,
    })
  }

  _submit = async() => {
    if(!this.state.password || this.state.password.length !== 6) {
      Alert.alert('密码错误')
    } else {
      await AsyncStorage.setItem('password', this.state.password)
      this.props.navigation.navigate(this.state.to)
    }
  }

  _renderButton = () => {
    return <Button color='#212b66' title='下一步' onPress={this._submit} />
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{padding:30}}>
        <Text style={{fontWeight:'bold',color:'#212b66',marginBottom:15}}>
          请设置交易密码</Text>
        <View style={{borderWidth:1,borderColor:'#b2b2b2',paddingVertical:10,paddingHorizontal:10,marginBottom:50}}>
          <TextInput
            secureTextEntry={true}
            value={this.state.value}
            onChangeText={(value) => this._setPassword(value)}
            keyboardType='number-pad' />
        </View>
        {this._renderButton()}
      </View>
    )
  }
}
