import React, {Component} from 'react'
import {StyleSheet, RefreshControl, ActivityIndicator, ScrollView, AsyncStorage, Alert, StatusBar, Dimensions, ImageBackground, Image, FlatList, Button, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {formatBalance} from '../utils'

global.web3.eth.getAccounts().then(console.log)

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
      price: 0,
      coins: [
        //{name:'BTC', code: 'btc', balance:'0.0000',value:'0.00'},
        {name:'ETH', code: 'eth', balance:'0.0000',value:'0.00'},
        //{name:'EOS', code: 'eos', balance:'0.0000',value:'0.00'}
      ],
      refreshing: false
    }
  }

  componentDidMount() {
    this._getAccount()
    this._getPrice()
  }

  _onRefresh = () => {
    this.setState({refreshing:true})
    this._getPrice()
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

  _getPrice = () => {
    let url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=CNY'
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': 'afa301a7-3f5d-4694-b87c-eb48e6e07cc8'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.data.ETH)
        this.setState({price:responseJson.data.ETH.quote.CNY.price})
      })
      .catch((error)=>console.log('api error'))
    //.catch((error) => Alert.alert(error.toString()))
  }

  _renderHeader = () => (
    <View style={styles.header}>
      <Text style={{color:'white'}}>币加</Text>
      <Icon name='maximize' size={20} color='white' />
    </View>
  )

  _renderMain = () => (
    <View style={styles.main}>
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
    </View>
  )

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Log')}>
      <View style={styles.item}>
        <Text style={{color:'rgb(78,78,78)'}}>{item.name}</Text>
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
