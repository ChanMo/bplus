import React, {Component} from 'react'
import {AsyncStorage,ImageBackground, TouchableOpacity, View, Text,Dimensions} from 'react-native'

const {width} = Dimensions.get('window')

const data = [
  {name:'text'},
  {name:'item'},
  {name:'value'},
  {name:'money'},
]

export default class UserScreen extends Component {
    static navigationOptions = {
        title: '删除钱包'
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
        <Text style={{fontSize:14,color:'#808080',marginTop:24,padding:10,backgroundColor:'white',lineHeight:18}}>注意！删除钱包前，请务必确认已备份好钱包助记词，否则将丢失您对钱包资产。</Text>
        <TouchableOpacity style={{marginTop:0}} onPress={()=>{this.props.navigation.navigate('DelectWallet')}}>
            <ImageBackground
                style={{height:42,margin:30}}
                imageStyle={{height:42,alignItems:'center'}}
                source={require('../images/wallet-btn.png')}>
                <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                    <Text style={{fontSize:12,color:'#ffffff',alignSelf:'center'}}>知道了，继续</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
            
    </View>
    )
  }
}
