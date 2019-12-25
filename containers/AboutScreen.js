import React, {Component} from 'react'
import { View, Image, Text,TouchableOpacity,FlatList} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Icon from 'react-native-vector-icons/Feather'


const data = [
  {name:'使用协议', path:'Agreement'},
  {name:'隐私条款', path:'Privacy'},
  {name:'联系我们', path:'Contact'},
]

export default class AboutScreen extends Component {
  static navigationOptions = {
    title: '关于',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }
  

  _renderItem = ({item,index}) => (
    <TouchableOpacity onPress={()=>item.path ? this.props.navigation.navigate(item.path, item.param) : null}
      style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:2,paddingHorizontal:15,paddingVertical:10,backgroundColor:'#ffffff',width:'100%',display:'flex'}}>
      <View style={{flexDirection:'row',alignItems:'center',height:30}}>
        <Text style={{color:'rgb(68,68,68)',fontSize:14}}>{item.name}</Text>
      </View>
      <Icon name='chevron-right' 
            size={14} 
            color='rgb(122,122,122)'/>
    </TouchableOpacity>
  )

  _keyExtractor = (item,i) => i.toString()

  render() {
    const version = DeviceInfo.getVersion()
    return (
      <View style={{flex:1,alignItems:'center',backgroundColor:'#f6f7fb'}}>
        <Image
          style={{width:80,height:80,marginBottom:15,marginTop:70}}
          source={require('../images/dark-logo.png')} />
        <Text style={{fontSize:14,color:'#4a4a4a',fontWeight:'600',marginBottom:15}}>
          当前版本 {version}</Text>
        <Text style={{color:'#808080',paddingLeft:20,paddingRight:20,fontSize:14}}>币加是一款移动端轻钱包App，旨在为数字货币爱好者提供最安全、便捷、专业且功能强大的数字资产钱包应用，致力于打造专业的数字货币支付平台，提供高效的数字货币体验</Text>
        <FlatList
          style={{flex:1,width:'100%',marginTop:40}}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}
