import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {ListItem} from 'react-native-elements'

const list = [
  {name:'关于'},
  {name:'版本'}
]

export default class SettingScreen extends Component {
  static navigationOptions = {
    title: '设置'
  }

  render() {
    return (
      <View style={{flex:1,paddingTop:15}}>
        {list.map((item,i) => (
          <ListItem 
            key={i} 
            containerStyle={{marginBottom:1}}
            chevron
            title={item.name} />
        ))}
      </View>
    )
  }
}
