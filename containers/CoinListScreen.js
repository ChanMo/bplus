import React, {Component} from 'react'
import {DeviceEventEmitter, AsyncStorage, FlatList, View, Text, Image, Switch} from 'react-native'

export default class CoinListScreen extends Component {
  static navigationOptions = {
    title: '管理币种'
  }

  constructor(props) {
    super(props)
    this.state = {
      coins: null,
      mycoins: []
    }
  }

  componentDidMount() {
    this._getCoins()
    this._getMyCoins()
  }

  _getMyCoins = async() => {
    const mycoins = await AsyncStorage.getItem('mycoins')
    mycoins && this.setState({mycoins:JSON.parse(mycoins)})
  }

  _getCoins = async() => {
    const coins = await AsyncStorage.getItem('coins')
    let coinsObj = JSON.parse(coins)
    this.setState({coins:Object.values(coinsObj)})
  }

  _setMyCoins(coin, value) {
    let mycoins = this.state.mycoins
    if(value) {
      mycoins.push(coin)
    } else {
      mycoins = mycoins.filter(item => item !== coin)
    }
    this.setState({
      mycoins: mycoins
    })
    AsyncStorage.setItem('mycoins', JSON.stringify(mycoins))
    DeviceEventEmitter.emit('mycoins_changed')
  }

  _keyExtractor = (item,i) => i.toString()

  _renderItem = ({item}) => {
    return (
      <View style={{flexDirection:'row',alignItems:'center',padding:15,backgroundColor:'white',marginBottom:1}}>
        <Image source={{uri:item.logo}} style={{width:32,height:32}} />
        <View style={{paddingHorizontal:10,flex:1}}>
          <View><Text>{item.symbol}</Text></View>
          <View><Text style={{color:'grey'}}>{item.name}</Text></View>
        </View>
        {item.symbol !== 'ETH' &&<Switch
          onValueChange={(value)=>this._setMyCoins(item.symbol, value)}
          value={this.state.mycoins.indexOf(item.symbol) >= 0} />}
      </View>
    )
  }

  render() {
    const coin = this.state.coinData
    console.log('render', this.state.mycoins)
    const mycoins = this.state.mycoins
    return (
      <FlatList
        data={this.state.coins}
        keyExtractor={this._keyExtractor}
        extraData={this.state}
        renderItem={this._renderItem}
      />
    )
  }
}
