import React, {Component} from 'react'
import {RefreshControl, ScrollView, ToastAndroid, DeviceEventEmitter, AsyncStorage, TouchableOpacity, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import Button from '../components/Button'

const key = 'G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W'

export default class AssetScreen extends Component {
  static navigationOptions = {
    title: '资产',
  }

  constructor(props) {
    super(props)
    this.state = {
      balance: 0,
      price: 0,
      refreshing: false,
      assets: '',
      assetsList: []
    }
    this._getPrice()
    this._getAssets()
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('asset_address_changed', 
      (e)=>this._getAssets())
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.price !== this.state.price 
      || prevState.assetsList !== this.state.assetsList) {
      this._calculate()
    }
  }

  _onRefresh = () => {
    this.setState({refreshing:true})
    this._getPrice()
  }

  _calculate = () => {
    let list = this.state.assetsList
    console.log(list)
    let amount = 0
    for(let i = 0; i<list.length; i++) {
      amount += list[i].balance*this.state.price/1000000000000000000
    }
    console.log(amount)
    this.setState({balance:amount.toFixed(4)})
  }

  _getPrice = () => {
    let url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${key}`
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => this.setState({
        refreshing: false,
        price:responseJson.result.ethusd
      }))
      .catch((error) => console.log(error))
  }

  _getAssets = async() => {
    const asset = await AsyncStorage.getItem('asset')
    console.log(asset)
    if(asset) {
      this.setState({assets:asset})
      this._getBalance()
    }
  }

  _getBalance = () => {
    let url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${this.state.assets}&tag=latest&apikey=${key}`
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => this.setState({
        assetsList: responseJson.result
      }))
      .catch((error) => ToastAndroid.show('服务器错误', ToastAndroid.SHORT))
  }

  _goAdd = () => {
    this.props.navigation.navigate('AssetAdd')
  }

  _renderHeader = () => {
    return (
      <View style={{
        margin:20,
        elevation: 2,
        borderRadius: 2,
        padding: 30
      }}>
        <Text style={{color:'#152162'}}>
          昨日盈亏</Text>
        <View style={{marginVertical:20,flexDirection:'row',alignItems:'center'}}>
          <Text style={{color:'white',backgroundColor:'#fca803',paddingHorizontal:4,marginRight:10,borderRadius:2,fontSize:12}}>CNY</Text>
          <Text style={{fontSize:20,color:'#1e296a'}}>0.00</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{color:'#1e296a',fontSize:12,marginRight:5}}>
            总金额</Text>
          <Text>{this.state.balance}</Text></View>
      </View>
    )
  }

  _renderList() {
    if(this.state.assetsList.length == 0) {
      return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Icon name='ios-rainy' size={80} 
            color='#95afc0' 
            style={{marginBottom:10}} />
          <Text>您还未添加任何资产</Text>
          <Button 
            containerStyle={{marginTop:20}}
            title='立即添加'
            onPress={this._goAdd}
          />
        </View>
      )
    }
    return (
      <View style={{flex:1,padding:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{marginBottom:10,color:'#1e296a'}}>资产列表</Text>
          <TouchableOpacity onPress={this._goAdd}>
            <Icon name='ios-add-circle' size={24} color='darkgrey' />
          </TouchableOpacity>
        </View>
        {this.state.assetsList.map((item,i) => (
          <View key={i} style={{backgroundColor:'white',padding:15,marginBottom:5,borderRadius:2,elevation:1}}>
            <Text>{item.account}</Text>
            <Text>{item.balance/1000000000000000000}eth</Text>
          </View>
        ))}
      </View>
    )
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        style={{flex:1,backgroundColor:'white'}}>
        {this._renderHeader()}
        {this._renderList()}
      </ScrollView>
    )
  }
}
