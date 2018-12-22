import React, {Component} from 'react'
import {StyleSheet, Dimensions,TouchableOpacity, ImageBackground, Image, View, Text, Button} from 'react-native'
const {width,height} = Dimensions.get('window')

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { navigate } = this.props.navigation
    return (
        <ImageBackground
          style={styles.container}
          imageStyle={{width:width,height:260,marginTop:height-260}}
          source={require('../images/welcoemBackimg.png')}>
            <Image
              style={{width:136,height:136,marginBottom:20}}
              source={require('../images/welcomeLogo.png')} />
            <Text style={{marginBottom:110,color:'#212b66',fontSize:18}}>
              欢迎使用币加</Text>
            <TouchableOpacity
              onPress={()=>navigate('SetPassword',{to:'CreateWallet'})}
              style={styles.button}>
              <Text style={{textAlign:'center'}}>创建钱包</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>navigate('ImportSeed')}
              style={styles.button}>
              <Text style={{textAlign:'center'}}>导入钱包</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#f7f6fc',
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  button: {
    backgroundColor:'#fff',
    marginBottom:20,
    height:46,
    justifyContent:'center',
    width:220,
    borderWidth:.3,
    borderColor:'#c7c7ce',
    borderRadius:5
  }
})
