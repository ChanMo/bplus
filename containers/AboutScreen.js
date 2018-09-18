import React, {Component} from 'react'
import {StatusBar, View, Image, Text} from 'react-native'

export default class AboutScreen extends Component {
  static navigationOptions = {
    title: '关于'
  }

  render() {
    return (
      <View style={{flex:1,alignItems:'center',backgroundColor:'white'}}>
        <StatusBar translucent={false} backgroundColor='darkgrey' />
        <Image 
          style={{width:120,height:120,marginBottom:15,marginTop:70}}
          source={require('../images/dark-logo.png')} />
        <Text style={{fontSize:14,color:'#4a4a4a',fontWeight:'600',marginBottom:50}}>
          币加  V0.0.1</Text>
        <Text style={{color:'#808080'}}>让技术为财富增值</Text>
        <Text style={{color:'#808080'}}>币加是您安全, 便捷的投资工具</Text>
      </View>
    )
  }
}
