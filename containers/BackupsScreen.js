import React, {Component} from 'react'
import {AsyncStorage,ImageBackground, TouchableOpacity,Alert, View, Text,Dimensions} from 'react-native'

export default class UserScreen extends Component {
    static navigationOptions = {
        title: '钱包工具'
      }
      constructor(props) {
        super(props)
        this._alert()
      }
  _alert = ()=>{
    Alert.alert('导出私钥','泄露助记词将导致资产丢失，请认真抄写，切勿截屏')
  }

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>console.log(1)} style={{flex:1}}>
        <Text style={{}}>{item.name}</Text>
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
      <View style={{flex:1,backgroundColor:'#f7f6fc',paddingLeft:10,paddingRight:10}}>
        <Text style={{color:'#212b66',fontSize:16,fontWeight:'bold',paddingTop:20}}>请记下您的钱包助记词并保存到安全的地方</Text>
        <Text style={{fontSize:14,color:'#808080',paddingTop:24,lineHeight:18}}>钱包助记词用于恢复钱包资产，拥有助记词即可完全控制钱包资产，请务必妥善保管，丢失助记词即失去钱包资产，B+不存储用户助记词，无法提供找回功能</Text>
        <View style={{backgroundColor:'#212b66',height:140,marginTop:30,borderRadius:5}}>
            {/* <FlatList
            style={{display:'flex'}}
            data={data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            /> */}
        </View>
        <TouchableOpacity style={{marginTop:100}} onPress={()=>{this.props.navigation.navigate('CopyWord')}}>
            <ImageBackground
                style={{height:42,margin:30}}
                imageStyle={{height:42,alignItems:'center'}}
                source={require('../images/wallet-btn.png')}>
                <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                    <Text style={{fontSize:12,color:'#ffffff',alignSelf:'center'}}>下一步</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
            
    </View>
    )
  }
}
