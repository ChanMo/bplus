import React, {Component} from 'react'
import {AsyncStorage,Clipboard, FlatList, Image, TouchableOpacity, View, Text,Dimensions,Platform} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import Identicon from 'identicon.js'
import api from '../api'
import Toast from 'react-native-simple-toast';
import IphoneX from './../reducers/isIphoneX'

const data = [
  // {name:'我的理财', icon:require('../images/user-asset.png'), path:'Income'},
  {name:'钱包工具', icon:require('../images/user-tools.png'), path:'ToolList'},
  //{name:'系统设置', icon:require('../images/user-setting.png'), path:'Setting'},
  // {name:'加入社群', icon:require('../images/user-us.png'), path:'Group'},
  {name:'帮助中心', icon:require('../images/user-help.png'), path:'Web', param:{title:'帮助中心',link:api.help}},
  {name:'关于', icon:require('../images/user-about.png'), path:'About'},
]

class UserScreen extends Component {

  _copyAddress = () => {
    Clipboard.setString(this.props.account)
    Toast.show('复制成功',1)
  }

  _filterShort(str) {
    return str.substr(0,10)+'......'+str.substr(-10)
  }

  _renderHeader = () => {
    const image = new Identicon(this.props.account, {size:420,background: [255, 255, 255]}).toString()

    return(
    <View
      style={{width:'100%',height:Platform.OS === 'ios' ? 236 : 204,backgroundColor:'#232c62'}}>
      <View style={{flexDirection:'row',
    ...IphoneX.ifIphoneX({
      marginTop: 44
    }, {
      marginTop: Platform.OS === 'ios' ? 20 : 0,
    }),alignItems:'center',justifyContent:'center',height:54}}>
        <Text style={{fontSize:16,alignSelf:'center',color:'white'}}>我的</Text>
      </View>
      <View style={{alignItems:'center',paddingVertical:16}}>
        <View style={{height:76,width:76,borderRadius:38,marginBottom:16,borderWidth:1,borderColor:'#f0f0f0',backgroundColor:'#ffffff',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
          <Image
            source={{uri:'data:image/png;base64,'+image}}
            style={{width:46,height:46,alignSelf:'center',borderRadius:5}} />
        </View>
        <Text style={{color:'#f0f0f0',fontSize:14,height:20}} onPress={this._copyAddress}>
          {this._filterShort(this.props.account)}  <Icon name={'copy'} size={18}></Icon>
        </Text>
      </View>
    </View>
  )}

  _renderItem = ({item,index}) => (
    <TouchableOpacity onPress={()=>item.path ? this.props.navigation.navigate(item.path, item.param) : null}
      style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:15,paddingVertical:10,backgroundColor:'white',marginTop:index==0?8:2}}>
      <View style={{flexDirection:'row',alignItems:'center',height:30}}>
        <Image source={item.icon} style={{width:30,height:30,marginRight:10}} />
        <Text style={{color:'rgb(68,68,68)',fontSize:14}}>{item.name}</Text>
      </View>
      <Icon name='chevron-right' size={24} color='rgb(122,122,122)' />
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
      <View style={{flex:1,backgroundColor:'#f6f7fb'}}>
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

const mapStateToProps = state => {
  return {
    account: state.account.address
  }
}

export default connect(mapStateToProps)(UserScreen)
