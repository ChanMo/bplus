import React, {Component} from 'react'
import {AsyncStorage, Alert, StatusBar, Dimensions, ImageBackground, Image, FlatList, Button, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

const {width} = Dimensions.get('window')
const wei = 1000000000000000000

export default class WalletScreen extends Component {
  static navigationOptions = {
    title: '钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      balance: '0.0000',
      value: 0.00,
      coins: [
        //{name:'BTC', code: 'btc', balance:'0.0000',value:'0.00'},
        {name:'ETH', code: 'eth', balance:'0.0000',value:'0.00'},
        //{name:'EOS', code: 'eos', balance:'0.0000',value:'0.00'}
      ]
    }
    this._getAccount()
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('wallet')
    this.setState({account:account})
    this._getBalance()
  }

  _getBalance = () => {
    let url = 'http://47.94.206.167:8545/'
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json_rpc: "2.0",
        method: "eth_getBalance",
        params: [this.state.account, 'latest'],
        id: 1
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        responseJson.result && this.setState({
          balance: (parseInt(responseJson.result)/wei).toFixed(4)
        })
      })
      .catch((error) => console.log(error))

  }

  _renderHeader = () => (
    <View style={{height:54,marginTop:20,flexDirection:'row',alignItems:'center',paddingHorizontal:15,justifyContent:'space-between'}}>
      <Text style={{color:'white'}}>币加</Text>
      <Icon name='maximize' size={20} color='white' />
    </View>
  )

  _renderMain = () => (
    <View style={{
      marginHorizontal: 15,
      marginTop: 10,
      marginBottom: 20,
      backgroundColor: 'white',
      borderRadius: 5,
    }}>
      <View style={{paddingHorizontal:20,paddingVertical:30}}>
        <Text style={{fontWeight:'600',fontSize:12,color:'#4a4a4a',marginBottom:10}}>
          我的资产</Text>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{marginRight:10,backgroundColor:'#ff9a00',borderRadius:2,paddingVertical:2,paddingHorizontal:6,fontSize:12,color:'white'}}>CNY</Text>
          <Text style={{fontSize:28,color:'rgb(81,81,114)'}}>{this.state.balance}</Text>
        </View>
      </View>
      <View style={{
        backgroundColor: 'rgb(232,236,245)',
        paddingVertical: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
      }}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Transfer')}
          style={{flex:1,alignItems:'center',paddingVertical:10,borderRightWidth:1,borderColor:'rgb(207,209,221)',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <Image
            source={require('../images/wallet_send.png')}
            style={{width:18,height:18,marginRight:10}} />
          <Text>转 账</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Receipt')}
          style={{flex:1,alignItems:'center',paddingVertical:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <Image
            source={require('../images/wallet_receive.png')}
            style={{width:18,height:18,marginRight:10}} />
          <Text>收 款</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Log')}>
      <View
        style={{
          backgroundColor:'white',
          marginBottom:5,
          paddingVertical:10,
          paddingHorizontal:15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius:5}}>
        <Text style={{color:'rgb(78,78,78)'}}>{item.name}</Text>
        <View>
          <Text style={{color:'rgb(46,46,46)'}}>{this.state.balance}</Text>
          <Text style={{fontSize:12,color:'rgb(184,186,206)'}}>
            ={this.state.value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  _renderEmpty = () => (
    <View>Empty</View>
  )

  _renderToken = () => {
    return (
      <FlatList
        style={{paddingHorizontal:15}}
        data={this.state.coins}
        keyExtractor={(item,i) => i.toString()}
        renderItem={this._renderItem}
        emptyComponent={this._renderEmpty}
      />
    )
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'rgb(245,243,251)'}}>
        <ImageBackground
          source={require('../images/wallet-bg.png')}
          imageStyle={{width:width,height:width*5/6}}
          style={{width:'100%',height:'100%'}}>
          {this._renderHeader()}
          {this._renderMain()}
          {this._renderToken()}
        </ImageBackground>
      </View>
    )
  }
}
