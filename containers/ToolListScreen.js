import React, {Component} from 'react'
import {AsyncStorage, FlatList, TouchableOpacity, View, Text,Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

const data = [
  {name:'修改交易密码',  path:'ChangePassword',param:{to:'ToolList'}},
  {name:'钱包备份',  path:'Password',param:{event:'back_ups'}},
  {name:'导出私钥',  path:'Password',param:{event:'derived_key'}},
  {name:'删除钱包',  path:'Password',param:{event:'delet_hint'}},
]

export default class UserScreen extends Component {
    static navigationOptions = {
        title: '钱包工具'
      }
  _renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>item.path ? this.props.navigation.navigate(item.path, item.param) : null}
      style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:15,paddingVertical:10,backgroundColor:'white',marginTop:2}}>
      <View style={{flexDirection:'row',alignItems:'center',height:34}}>
        <Text style={{color:'rgb(68,68,68)'}}>{item.name}</Text>
      </View>
      <Icon name='chevron-right' size={20} color='rgb(122,122,122)' />
    </TouchableOpacity>
  )

  _keyExtractor = (item,i) => i.toString()

  _clear = async() => {
    try {
      await AsyncStorage.clear()
      this.props.navigation.navigate('Auth')
    } catch(error) {
    }
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'rgb(245,243,251)'}}>
        <FlatList
          style={{flex:1}}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}
