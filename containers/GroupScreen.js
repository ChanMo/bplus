import React, {Component} from 'react'
import { View, Text, Image} from 'react-native'

export default class GroupScreen extends Component {
  static navigationOptions = {
    title: '加入社群',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f6f7fb',alignItems:'center'}}>
        <Image 
          style={{width:140,height:140,marginTop:70,marginBottom:15}}
          source={require('../images/group.png')} />
        <Text style={{color:'#4a4a4a'}}>添加客服回复"币加"进群</Text>
      </View>
    )
  }
}
