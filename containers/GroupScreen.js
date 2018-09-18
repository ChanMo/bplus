import React, {Component} from 'react'
import {StatusBar, View, Text, Image} from 'react-native'

export default class GroupScreen extends Component {
  static navigationOptions = {
    title: '加入社群'
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',alignItems:'center'}}>
        <StatusBar translucent={false} backgroundColor='darkgrey' />
        <Image 
          style={{width:140,height:140,marginTop:70,marginBottom:15}}
          source={require('../images/group.png')} />
        <Text style={{color:'#4a4a4a'}}>添加客服回复"币加"进群</Text>
      </View>
    )
  }
}
