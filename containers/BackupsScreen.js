import React, {Component} from 'react'
import {AsyncStorage,ImageBackground, TouchableOpacity,Alert, View, Text,Dimensions} from 'react-native'

export default class BackupsScreen extends Component {
    static navigationOptions = {
        title: '钱包备份',
        headerStyle:{
            borderBottomWidth:0,
            shadowOpacity:0,
            elevation:0,
        }
      }
      
      constructor(props) {
        super(props)
        this._alert()
        this.state = {
            words:[]
        }
      }

      componentDidMount() {
        console.log(this.props)
        this._getwords()
      }

      _getwords = () => {
        AsyncStorage.getItem('mnemonic').then(result =>this.setState({words:result.split(' ')}))
      }
  _alert = ()=>{
    Alert.alert('备份助记词','泄露助记词将导致资产丢失，请认真抄写，切勿截屏',
    [{
      text:"ok", 
      // onPress:()=>{this.props.navigation.navigate('CopyWord')}
    }]
    )
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
      <View style={{flex:1,backgroundColor:'#f6f7fb',paddingLeft:10,paddingRight:10}}>
        <Text style={{color:'#212b66',fontSize:16,fontWeight:'bold',paddingTop:20}}>请记下您的钱包助记词并保存到安全的地方</Text>
        <Text style={{fontSize:14,color:'#808080',paddingTop:24,lineHeight:18}}>钱包助记词用于恢复钱包资产，拥有助记词即可完全控制钱包资产，请务必妥善保管，丢失助记词即失去钱包资产，B+不存储用户助记词，无法提供找回功能</Text>
        <View style={{backgroundColor:'#212b66',height:140,marginTop:30,padding:5,borderRadius:5,display:"flex",flexDirection:'row',flexWrap:'wrap'}}>
           {this.state.words.map((item,index)=>{return(<Text key={index} style={{padding:5,color:'#ffffff'}} key={index}>{item}</Text>)})}
        </View>
        <TouchableOpacity style={{marginTop:100}} onPress={()=>{this.props.navigation.navigate('ValidateWord',{isFirst:true})}}>
            <ImageBackground
                style={{height:42,margin:30}}
                imageStyle={{height:42,alignItems:'center'}}
                source={require('../images/wallet-btn.png')}>
                <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                    <Text style={{fontSize:12,color:'#ffffff',alignSelf:'center'}}>下一步</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>

        {this.props.navigation.getParam('isFirst')?<Text onPress={()=>this.props.navigation.navigate('Home')} style={{textAlign:'center',color:'#999999',position:'absolute',marginBottom:20,height:30,lineHeight:30,bottom:0,alignSelf:'center'}}>试用一下，暂时跳过</Text>:null}
    </View>
    )
  }
}
