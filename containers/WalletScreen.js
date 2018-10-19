import React, {Component} from 'react'
import {DeviceEventEmitter, StyleSheet, RefreshControl, ActivityIndicator, ScrollView, AsyncStorage, Alert, StatusBar, Dimensions, ImageBackground, Image, FlatList, Button, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {formatBalance} from '../utils'
import tokens from '../tokens'
import {getMarketData, getBalance} from '../utils'
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
      prices: [], // 市场价格列表
      popShow:false
    }
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('mycoins_changed', (e)=>this._getCoins())
    this._getAccount() // 获取account地址
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account})
    this._getCoins() // 获取用户tokens
  }

  // 获取用户收藏的token列表
  _getCoins = async() => {
    let coins = await AsyncStorage.getItem('mycoins')
    coins = JSON.parse(coins)
    let tokens = []
    coins.map(item =>
      tokens.push({
        'token':item,
        'balance':getBalance(this.state.account, item)
      })
    )
    return this.setState({coins:tokens})
  }

  // 计算总资产
  _getTotal = () => {
    let total = 0.0000
    this.state.coins.map(item => {
      let priceObj = this.state.prices[item.name]
      let price = priceObj ? priceObj.quote.CNY.price : 0.00
      total += item.balance * price
    })
    console.log('total', total)
    return total.toFixed(4)
  }

  // 从存储器中获取市场数据
  _getMarket = async() => {
    const market = await AsyncStorage.getItem('market')
    return JSON.parse(market)
  }

  _onRefresh = () => {
    this.setState({refreshing:true})
    this._getCoins().then(()=>this.setState({refreshing:false}))
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
      <TouchableOpacity onPress={()=>{this.setState({popShow:!this.state.popShow})}}>
        <Icon name='plus' size={26} color='white' />
      </TouchableOpacity>
    </View>
  )

  _renderPop = () =>{
    return(
      <ImageBackground
      style={{height:90,width:140,position:'absolute',zIndex:9999,top:64,right:10,display:this.state.popShow?'flex':'none'}}
      source={require('../images/pop-up.png')}
      imageStyle={{width:140,height:90}}>
        <TouchableOpacity  onPress={()=>this.props.navigation.navigate('CoinList')} style={{padding:6,paddingLeft:25,marginTop:14,display:'flex',flexDirection:'row'}}>
          <Icon name='plus' size={20} color='#808080' />
          <Text style={{flex:1,lineHeight:20,paddingLeft:5,color:'#808080'}}>添加资产</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding:6,paddingLeft:25,marginTop:6,display:'flex',flexDirection:'row'}}>
          <Icon name='maximize' size={20} color='#808080' />
          <Text style={{flex:1,lineHeight:20,paddingLeft:5,color:'#808080'}}>扫一扫</Text>
        </TouchableOpacity>
    </ImageBackground>
    )
  }

  _renderMain = () => {
    return (
      <ImageBackground
        source={require('../images/log-bg.png')} style={styles.main}>
        <View style={{paddingHorizontal:20,paddingVertical:30}}>
          <Text style={styles.mainTitle}>我的资产</Text>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={styles.mainCNY}>CNY</Text>
            <Text style={styles.mainBalance}>{this._getTotal()}</Text>
          </View>
        </View>
        <View style={styles.mainActionContainer}>
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
  }
  _renderItem(item, market) {
    const priceObj = market[item.name]
    const price = priceObj ? priceObj.quote.CNY.price.toFixed(2) : 0.00
    const status = priceObj ? priceObj.quote.CNY.percent_change_24h.toFixed(2) : 0.00
    const balance = (item.balance * price).toFixed(2)
    return(
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('Log', {token:item.token})}>
        <View style={styles.item}>
          <Text style={{color:'rgb(78,78,78)'}}>{item.token}</Text>
          <View style={{alignItems:'flex-end'}}>
            <Text style={{fontWeight:'bold',
              color:status > 0 ? 'blue' : 'red'}}>{price}</Text>
            <Text style={{fontSize:12,
              color:status > 0 ? 'blue' : 'red'}}>{status}%</Text>
          </View>
          <View style={{alignItems:'flex-end'}}>
            <Text style={{color:'rgb(46,46,46)'}}>{item.balance}</Text>
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
    const market = this._getMarket()
    return (
      <FlatList
        style={{paddingHorizontal:15}}
        data={this.state.coins}
        keyExtractor={(item,i) => i.toString()}
        renderItem={({item}) => this._renderItem(item, market)}
        extraData={this.state}
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
          {this._renderPop()}
          <ScrollView
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh} />
            }>
            {this._renderMain()}
            {this._renderToken()}
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
  mainTitle: {
    fontWeight:'600',
    fontSize:12,
    color:'#4a4a4a',
    marginBottom:10
  },
  mainCNY: {
    marginRight:10,
    backgroundColor:'#ff9a00',
    borderRadius:2,
    paddingVertical:2,
    paddingHorizontal:6,
    fontSize:12,color:'white'
  },
  mainBalance: {
    fontSize:28,
    color:'rgb(81,81,114)'
  },
  mainActionContainer: {
    backgroundColor: 'rgb(232,236,245)',
    paddingVertical: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row',
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
