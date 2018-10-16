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
      input:'',
      password: '',
      changeTip:'请输入密码',
      passwordState:0
    }
  }

  componentDidMount() {
    const to = this.props.navigation.getParam('to')
    this.setState({to:to})
  }

  _setPassword(value) {
    this.setState({
      input: value,
    })
    if(value.length===6){
      this._submit(value,this.state.passwordState)
    }
  }

  _submit = async(value,passwordState) => {
    switch(passwordState){
      case 0:
        this.setState({
          input: '',
          password: value,
          changeTip:'请输入新密码',
          passwordState:1
        })
      break;
      case 1:
        if(value == this.state.password){
          await AsyncStorage.setItem('password', value)
          this.props.navigation.navigate(this.state.to)
        }
        else{
          this.setState({
            input: ''
          })
          Alert.alert('两次密码不一致，请重新输入')
        }
      break;
    }
  }

  _getFocus = () =>{
    var passw = this.refs.passwords;
    passw.focus()
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

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
        {this._renderHeader()}
        <View style={{flex:1,padding:20}}>
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
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[0]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[1]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[2]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[3]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[4]?'*':''}</Text>
              <Text onPress={()=>{this._getFocus()}} style={styles.oneInput}>{this.state.input[5]?'*':''}</Text>
            </View>
          </View>
          <View style={{padding:5,marginTop:10}}>
            <View style={styles.tiplist}>
              <View style={styles.tiplogo}></View>
              <Text style={styles.tiptext}>密码用于保护私钥和交易授权</Text>
            </View>
            <View style={styles.tiplist}>
              <View style={styles.tiplogo}></View>
              <Text style={styles.tiptext}>币加不储存密码，也无法帮您找回，请务必牢记</Text>
            </View>
            <View style={styles.tiplist}>
              <View style={styles.tiplogo}></View>
              <Text style={styles.tiptext}>如果忘记密码，只能通过助记词导入重新设置密码</Text>
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
  },
  tiplist:{
    display:'flex',
    flexDirection:'row',
    width:'100%',
    padding:2
  },
  tiplogo:{
    height:10,
    width:10,
    borderRadius:5,
    backgroundColor:'#212b66',
    margin:5,
  },
  tiptext:{
    flex:1,
    fontSize:13,
    color:'#808080',
    lineHeight:20
  }

}
