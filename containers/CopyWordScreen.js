import React, {Component} from 'react'
import {AsyncStorage,ImageBackground,FlatList, TouchableOpacity, View, Text,Dimensions} from 'react-native'

export default class UserScreen extends Component {
    static navigationOptions = {
        title: '钱包工具'
    }
    constructor(props) {
        super(props)
        this.state = {
            words:[
              'text',
              'number',
              'window',
              'value',
              'display',
              'text',
              'number',
              'window',
              'value',
              'display',
              'text',
              'number',
              'window'
            ]
        }
    }

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
        <Text style={{color:'#212b66',fontSize:16,fontWeight:'bold',paddingTop:20,textAlign:'center'}}>立即备份你的助记词</Text>
        <Text style={{fontSize:14,color:'#808080',paddingTop:24,lineHeight:18,textAlign:'center'}}>助记词用于恢复钱包重置密码，抄写到纸上，并保存在安全对地方，不要保存在网络上</Text>
        <View style={{backgroundColor:'#ffffff',height:140,marginTop:30,padding:5,borderRadius:5,display:"flex",flexDirection:'row',flexWrap:'wrap'}}>
            {this.state.words.map((item,index)=>{
                return(
                    <Text style={{padding:5}}>{item}</Text>
                )
            })}
        </View>
        <TouchableOpacity style={{marginTop:100}} onPress={()=>{this.props.navigation.navigate('ValidateWord')}}>
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
