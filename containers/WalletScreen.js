import React, {Component} from 'react'
import {DeviceEventEmitter, StyleSheet, RefreshControl, ActivityIndicator, ScrollView, AsyncStorage, Alert, StatusBar, Dimensions, ImageBackground, Image, FlatList, Button, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {formatBalance} from '../utils'
import tokens from '../tokens'

global.web3.eth.getAccounts().then(console.log)
console.log(web3.currentProvider.connected)

const {width} = Dimensions.get('window')

export default class WalletScreen extends Component {
  static navigationOptions = {
    title: '钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      refreshing: false,
      coins: [], // 用户收藏token
      balances: [], // token数量列表
      prices: [], // 市场价格列表
    }
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('mycoins_changed', (e)=>this._getCoins())
    this._getPrice() // 获取每个token价格
    this._getAccount()
  }

  // 获取用户收藏的token列表
  _getCoins = async() => {
    const coins = await AsyncStorage.getItem('mycoins')
    console.log(coins)
    this.setState({coins:JSON.parse(coins)})
    this._getTokenBalance() // 获取每个token数量
  }

  // 获取用户token的市场价格
  _getPrice = async() => {
    const prices = await AsyncStorage.getItem('prices')
    console.log(prices)
    console.log(Object.keys(tokens))
    if(prices) {
      this.setState({prices: JSON.parse(prices)})
    } else {
      let coins = Object.keys(tokens)
      coins.push('ETH')
      this._fetchPrice(coins)
    }
    //console.log(this.state.prices.BAT.quote.CNY.price)
  }

  // 获取用户所有token数量
  _getTokenBalance = () => {
    this.state.coins.map((item) => {
      if(item == 'ETH') {
        this._getEthBalance()
      } else {
        // 获取单个token数量
        this._getTokenBalanceItem(item)
      }
    })
  }

  // 获取单个token数量
  _getTokenBalanceItem = (token) => {
    console.log('b+', token)
    let tokenData = tokens[token]
    if(!tokenData) {
      return
    }
    console.log(tokenData)
    let contract = new web3.eth.Contract(JSON.parse(tokenData.abi), tokenData.address)
    console.log(this.state.account)
    //console.log(Object.keys(contract.methods).toString())
    console.log(contract.methods.balanceOf(this.state.account).call())
    contract.methods.balanceOf(this.state.account).call().then((res) => console.log('b+', res)).catch((error)=>console.log(error))
  }

  // 从接口获取tokens的市场价格
  _fetchPrice = (coins) => {
    coins = coins.toString()
    console.log('_fetchPrice', coins)
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
        AsyncStorage.setItem('prices', JSON.stringify(responseJson.data))
        this.setState({prices: responseJson.data})
      })
      .catch((error)=>console.log('api error'))

  }

  _onRefresh = () => {
    this.setState({refreshing:true})
    //this._getPrice()
    //this._getBalance().then(()=>this.setState({refreshing:false}))

  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account})
    this._getCoins()
    //this._getBalance()
  }

  // 获取eth数量
  _getEthBalance = () => {
    return web3.eth.getBalance(this.state.account)
      .then((res)=>web3.utils.fromWei(res, 'ether'))
      .then((balance)=>{
        let balances = this.state.balances
        balances['ETH'] = balance
        this.setState({balances:balances})
      })
      .catch((error)=>Alert.alert(error.toString()))
  }

  _renderHeader = () => (
    <View style={styles.header}>
      <View style={{flexDirection:'row'}}>
        <Text style={{color:'white',marginRight:10}}>币加</Text>
        {web3.currentProvider.connected ? (
          <Text style={{color:'green'}}>正常</Text>
        ) : (
          <Text style={{color:'red'}}>未连接</Text>
        )}
      </View>
      <Icon name='maximize' size={20} color='white' />
    </View>
  )

  _renderMain = () => {
    // 计算总资产
    let balance = 0.0000
    this.state.balances.map(item => {
      let priceObj = this.state.prices[item]
      let price = priceObj ? priceObj.quote.CNY.price : 0.00
      balance += item * price
    })
    console.log(balance)
    return (
      <ImageBackground
        source={require('../images/log-bg.png')} style={styles.main}>
        <View style={{paddingHorizontal:20,paddingVertical:30}}>
          <Text style={{fontWeight:'600',fontSize:12,color:'#4a4a4a',marginBottom:10}}>
            我的资产</Text>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{marginRight:10,backgroundColor:'#ff9a00',borderRadius:2,paddingVertical:2,paddingHorizontal:6,fontSize:12,color:'white'}}>CNY</Text>
            <Text style={{fontSize:28,color:'rgb(81,81,114)'}}>{balance.toFixed(4)}</Text>
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
          onPress={()=>this.props.navigation.navigate('Password',{to:'Transfer'})}>
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
  }
  _renderItem = ({item}) => {
    const priceObj = this.state.prices[item]
    const price = priceObj ? priceObj.quote.CNY.price.toFixed(2) : 0.00
    const status = priceObj ? priceObj.quote.CNY.percent_change_24h.toFixed(2) : 0.00
    const count = this.state.balances[item] ? this.state.balances[item] : 0
    const balance = (count * price).toFixed(2)
    return(
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('Log')}>
        <View style={styles.item}>
          <Text style={{color:'rgb(78,78,78)'}}>{item.toString()}</Text>
          <View style={{alignItems:'flex-end'}}>
            <Text style={{fontWeight:'bold',
              color:status > 0 ? 'blue' : 'red'}}>{price}</Text>
            <Text style={{fontSize:12,
              color:status > 0 ? 'blue' : 'red'}}>{status}%</Text>
          </View>
          <View style={{alignItems:'flex-end'}}>
            <Text style={{color:'rgb(46,46,46)'}}>{count}</Text>
            <Text style={{fontSize:12,color:'rgb(184,186,206)'}}>≈{balance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

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
        extraData={this.state}
        emptyComponent={this._renderEmpty}
      />
    )
  }

  render() {
    console.log('balances', this.state.balances)
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
