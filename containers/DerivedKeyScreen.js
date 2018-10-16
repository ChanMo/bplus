import React, {Component} from 'react'
import { View, Text,TouchableOpacity,ImageBackground,Clipboard,Alert,AsyncStorage} from 'react-native'

export default class UserScreen extends Component {
    static navigationOptions = {
        title: '导出私钥'
    }
    constructor(props) {
        super(props)
        this.state = {
            copyText:''
        }
    }

    componentDidMount() {
        this._gettext()
    }

    _gettext = () => {
        AsyncStorage.getItem('privateKey').then(result =>{
            this.setState({copyText:result})
        })
    }

    async _copytext() {
        Clipboard.setString(this.state.copyText);
        var content = await Clipboard.getString();
        Alert.alert('您已成功复制到剪切板，请妥善保管')
      }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f7f6fc',paddingLeft:10,paddingRight:10}}>
        <Text style={{padding:20,color:'#ffb425'}}>安全警告：私钥未经加密，导出存在风险，建议使用助记词和Keystore进行备份。</Text>
        <View style={{backgroundColor:'#ffffff',justifyContent:'center',padding:5,borderRadius:5,display:"flex",flexDirection:'row',flexWrap:'wrap'}}>
            <Text style={{textAlign:"center"}}>{this.state.copyText}</Text>
        </View>
        <TouchableOpacity style={{marginTop:100}} onPress={()=>{this._copytext()}}>
            <ImageBackground
                style={{height:42,margin:30}}
                imageStyle={{height:42,alignItems:'center'}}
                source={require('../images/wallet-btn.png')}>
                <View style={{alignItems:'center',justifyContent:'center',height:42}}>
                    <Text style={{fontSize:12,color:'#ffffff',alignSelf:'center'}}>复制到剪切板</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    </View>
    )
  }
}
