import React, {Component} from 'react'
import {DeviceEventEmitter, StyleSheet, RefreshControl, ActivityIndicator, ScrollView, AsyncStorage, Alert, StatusBar, Dimensions, ImageBackground, Image, FlatList, Button, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {formatBalance} from '../utils'
import tokens from '../tokens'

//global.web3.eth.getAccounts().then(console.log)

const {width} = Dimensions.get('window')

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
      price: 0,
      coins: [],
      coins_price: [],
      refreshing: false
    }
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('mycoins_changed', (e)=>this._getCoins())
    this._getCoins()
    this._getAccount()
    this._getPrice()
    this._getTokenBalance()
  }

  _getCoins = async() => {
    const coins = await AsyncStorage.getItem('mycoins')
    console.log(coins)
    this.setState({coins:JSON.parse(coins)})
    this._getPrice()
  }

  _getPrice = async() => {
    const prices = await AsyncStorage.getItem('coins_price')
    if(prices) {
      this.setState({coins_price: JSON.parse(prices)})
    } else {
      this._fetchPrice()
    }
    console.log(this.state.coins_price)
  }

  /** 获取所有token金额 **/
  _getTokenBalance = () => {
    this.state.coins.map((item) => {
      console.log('b+', item)
      if(item !== 'ETH') {
        /** 获取单个token金额 **/
        this._getTokenBalanceItem(item)
      }
    })
  }

  /** 获取单个token金额 **/
  _getTokenBalanceItem = (token) => {
    console.log('b+', token)
    let tokenData = tokens[token]
    let contract = new web3.eth.Contract(JSON.parse(tokenData.abi), tokenData.address)
    contract.methods.balanceOf(this.state.account).call().then((res) => console.log('b+', res))
  }

  _fetchPrice = () => {
    let coins = this.state.coins.toString()
    let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coins}&convert=CNY`
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': 'afa301a7-3f5d-4694-b87c-eb48e6e07cc8'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.data)
        AsyncStorage.setItem('coins_price', JSON.stringify(responseJson.data))
        this.setState({coins_price: responseJson.data})
      })
      .catch((error)=>console.log('api error'))

  }

  _onRefresh = () => {
    this.setState({refreshing:true})
    //this._getPrice()
    this._getBalance().then(()=>this.setState({refreshing:false}))

  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account})
    this._getBalance()
  }

  _getBalance = () => {
    return web3.eth.getBalance(this.state.account)
      .then((res)=>web3.utils.fromWei(res, 'ether'))
      .then((balance)=>this.setState({balance:balance}))
      .catch((error)=>Alert.alert(error.toString()))
  }

  _renderHeader = () => (
    <View style={styles.header}>
      <Text style={{color:'white'}}>币加</Text>
      <Icon name='maximize' size={20} color='white' />
    </View>
  )

  _renderMain = () => (
    <ImageBackground source={require('../images/log-bg.png')} style={styles.main}>
      <View style={{paddingHorizontal:20,paddingVertical:30}}>
        <Text style={{fontWeight:'600',fontSize:12,color:'#4a4a4a',marginBottom:10}}>
          我的资产</Text>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{marginRight:10,backgroundColor:'#ff9a00',borderRadius:2,paddingVertical:2,paddingHorizontal:6,fontSize:12,color:'white'}}>CNY</Text>
          <Text style={{fontSize:28,color:'rgb(81,81,114)'}}>{formatBalance(this.state.balance, 4)}</Text>
        </View>
      </View>
      <View style={{
        backgroundColor: 'rgb(232,236,245)',
        paddingVertical: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        style={[styles.mainAction, {borderRightWidth:1}]}
        onPress={()=>this.props.navigation.navigate('Transfer')}>
          <Image
            source={require('../images/wallet_send.png')}
            style={{width:18,height:18,marginRight:10}} />
          <Text>转 账</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mainAction}
          onPress={()=>this.props.navigation.navigate('Receipt')}>
          <Image
            source={require('../images/wallet_receive.png')}
            style={{width:18,height:18,marginRight:10}} />
          <Text>收 款</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Log')}>
      <View style={styles.item}>
        <Text style={{color:'rgb(78,78,78)'}}>{item.toString()}</Text>
        <View style={{alignItems:'flex-end'}}>
          <Text style={{color:'rgb(46,46,46)'}}>{this.state.balance}</Text>
          <Text style={{fontSize:12,color:'rgb(184,186,206)'}}>
            ≈{formatBalance(this.state.balance*this.state.price, 2)}</Text>
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
      <View style={{backgroundColor:'rgb(245,243,251)'}}>
        <ImageBackground
          source={require('../images/wallet-bg.png')}
          imageStyle={{width:width,height:width*5/6}}
          style={{width:'100%',height:'100%'}}>
          {this._renderHeader()}
          <ScrollView
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh} />
            }>
            {this._renderMain()}
            {this._renderToken()}
            <TouchableOpacity
              onPress={()=>this.props.navigation.navigate('CoinList')}
              style={{alignItems:'center',paddingVertical:10}}>
              <Text>管理币种</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height:54,
    marginTop:20,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:15,
    justifyContent:'space-between'
  },
  bg: {

  },
  main: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    overflow:"hidden"
  },
  mainAction: {
    flex:1,
    alignItems:'center',
    paddingVertical:10,
    borderColor:'rgb(207,209,221)',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  item: {
    backgroundColor:'white',
    marginBottom:5,
    paddingVertical:10,
    paddingHorizontal:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius:5
  }
})
