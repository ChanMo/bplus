import React, {Component} from 'react'
import {DeviceEventEmitter, ToastAndroid, AsyncStorage, View, Text} from 'react-native'
import {Input} from 'react-native-elements'
import Button from '../components/Button'

export default class AssetAddScreen extends Component {
  static navigationOptions = {
    title: '添加资产'
  }

  constructor(props) {
    super(props)
    this.state = {
      address: '',
      asset: ''
    }
    this._getAsset()
  }

  _getAsset = async() => {
    let asset = await AsyncStorage.getItem('asset', null)
    if (asset){
      this.setState({asset:asset})
    }
    //this.setState({assets:asset.split(',')})
  }

  _add = async() => {
    let asset = this.state.asset
    let assets = asset ? asset.split(',') : []
    assets.push(this.state.address)
    await AsyncStorage.setItem('asset', assets.join())
    DeviceEventEmitter.emit('asset_address_changed')
    ToastAndroid.show('添加成功', ToastAndroid.SHORT)
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',padding:30}}>
        <View style={{marginBottom:20}}>
          <Text>钱包地址</Text>
          <Input 
            onChangeText={(value)=>this.setState({address:value})}
            placeholder='请输入钱包地址' />
        </View>
        <Button 
          disabled={this.state.address.length!==42} 
          onPress={this._add}
          title='添加' />
      </View>
    )
  }
}
