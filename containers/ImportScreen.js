import React, {Component} from 'react'
import {View, TextInput, Text, Button} from 'react-native'

export default class ImportScreen extends Component {
  static navigationOptions = {
    title: '导入钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      keystore: null
    }
  }

  render() {
    return (
      <View style={{flex:1,padding:30}}>
        <Text style={{fontWeight:'bold',marginBottom:15}}>
          请输入钱包keystore</Text>
        <View style={{borderWidth:1,borderColor:'lightgrey',borderRadius:2,marginBottom:30}}>
          <TextInput 
            numberOfLines={4}
            multiline={true}
            value={this.state.keystore}
            onChangeText={(value)=>this.setState({keystore:value})}
          />
        </View>
        <Button title='立即导入' color='#212b66' onPress={()=>this.props.navigation.navigate('Password')} />
      </View>
    )
  }
}
