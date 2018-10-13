import React, {Component} from 'react'
import {AsyncStorage,ImageBackground,TextInput, TouchableOpacity, View, Text,Dimensions,Alert} from 'react-native'

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
        <Text style={{color:'#212b66',fontSize:16,fontWeight:'bold',paddingTop:20}}>请输入备份的钱包助记词(12个英文单词)</Text>
        <View style={{backgroundColor:'#fff',height:140,marginTop:30,borderRadius:5}}>
            <TextInput
              placeholder='请输入备份的钱包助记词,按空格分隔'
              multiline="true"
              blurOnSubmit='false'
              autoCapitalize='none'
              style={{height:100,padding:20,paddingTop:20,paddingBottom:20}}></TextInput>
        </View>
        <TouchableOpacity style={{marginTop:100}} onPress={()=>{
          Alert.alert('导出私钥','钱包助记词验证已通过，确认是否删除钱包？',
          [
            {text: '取消', onPress: () => console.log('Ask me later pressed')},
            {text: '确定', onPress: () => {this._clear()}, style: 'cancel'}
          ])
        }}>
            <ImageBackground
                style={{height:42,margin:30}}
                imageStyle={{height:42,alignItems:'center'}}
                source={require('../images/wallet-btn.png')}>
                <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                    <Text style={{fontSize:12,color:'#ffffff',alignSelf:'center'}}>立即验证</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
            
    </View>
    )
  }
}
