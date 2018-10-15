import React, {Component} from 'react'
import {AsyncStorage, Button, ImageBackground, StatusBar, FlatList, Image, TouchableOpacity, View, Text,Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import api from '../api'

const {width} = Dimensions.get('window')

const data = [
  {name:'我的理财', icon:require('../images/user-asset.png'), path:'Income'},
  {name:'钱包工具', icon:require('../images/user-tools.png'), path:'ToolList'},
  // {name:'系统设置', icon:require('../images/user-setting.png'), path:'Setting'},
  {name:'加入社群', icon:require('../images/user-us.png'), path:'Group'},
  {name:'帮助中心', icon:require('../images/user-help.png'), path:'Web', param:{title:'帮助中心',link:api.help}},
  {name:'关于我们', icon:require('../images/user-about.png'), path:'About'},
]

export default class UserScreen extends Component {

  _renderHeader = () => (
    <ImageBackground
      style={{width:'100%',height:74}}
      imageStyle={{width:width,height:74}}
      source={require('../images/wallet-bg.png')}>
      <View style={{flexDirection:'row',marginTop:20,alignItems:'center',justifyContent:'center',height:54}}>
        <Text style={{fontSize:16,alignSelf:'center',color:'white'}}>我的</Text>
      </View>
    </ImageBackground>
  )

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>item.path ? this.props.navigation.navigate(item.path, item.param) : null}
      style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:15,paddingVertical:10,backgroundColor:'white',marginTop:2}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image source={item.icon} style={{width:32,height:32,marginRight:10}} />
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
        {this._renderHeader()}
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
