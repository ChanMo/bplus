import React, {Component} from 'react'
import {Alert, AsyncStorage,StyleSheet, View, TextInput, Text, Button} from 'react-native'

export default class SetPasswordScreen extends Component {
  static navigationOptions = {
    title: '设置密码'
  }

  constructor(props) {
    super(props)
    this.state = {
      to: null,
      password: ''
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
    if(value.length===6){
      this._submit(value)
    }
  }

  _submit = async(value) => {
    if(!value || value.length !== 6) {
      Alert.alert('密码错误')
    } else {
      Alert.alert(value)
      await AsyncStorage.setItem('password', value)
      this.props.navigation.navigate(this.state.to)
    }
  }

  _getFocus = () =>{
    var passw = this.refs.passwords;
    passw.focus()
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
        <View style={{flex:1,padding:30}}>
          <View style={styles.input}>
            <TextInput
              value={this.state.input}
              keyboardType='numeric'
              ref='passwords'
              maxLength={6}
              autoFocus={true}
              onChangeText={(value)=>this._setPassword(value)}
              height={0}/>
            <View style={{display:'flex',flexDirection:'row'}}>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.password[0]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.password[1]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.password[2]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.password[3]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.password[4]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.password[5]?'*':''}</Text>
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
