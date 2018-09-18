import React, {Component} from 'react'
import {StyleSheet, Dimensions, ImageBackground, Image, View, Text, Button} from 'react-native'
const {width} = Dimensions.get('window')

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <Image 
          style={{width:80,height:80,marginBottom:20}}
          source={require('../images/logo.png')} />
        <Text style={{marginBottom:120,color:'#212b66',fontSize:18}}>
          欢迎使用币加</Text>
        <View style={{width:'50%',marginBottom:20}}>
          <Button 
            color='#212b66'
            onPress={()=>navigate('SetPassword')}
            title='创建钱包' />
        </View>
        <View style={{width:'50%'}}>
          <Button 
            color='#212b66'
            onPress={()=>navigate('Import')}
            title='导入钱包' />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})
