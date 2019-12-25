import React, {Component} from 'react'
import {DeviceEventEmitter, StyleSheet, RefreshControl,Platform, ActivityIndicator, ScrollView, Dimensions, ImageBackground, Image, FlatList, Button, View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux'
import { addToken, fetchBalance, updateAsset } from '../actions'
import Identicon from 'identicon.js'

import tokens from '../tokens'
const {width} = Dimensions.get('window')
import imageUrl from '../imageUrl'

class WalletScreen extends Component {
  static navigationOptions = {
    title: '钱包',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      popShow:false,
    }
  }

  componentDidMount() {
    console.log(this.props.tokens)
    this.props.tokens.map(item => this.props.fetchBalance(
      this.props.account, item.token))
    this.makeTotalAsset()
    DeviceEventEmitter.addListener('scanner_success',
      (e)=>this.props.navigation.navigate('Transfer', {'token':'ETH','to':e}))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.tokens.length != this.props.tokens.length) {
      // add or remove
      console.log('add or remove tokens')
      this.props.tokens.map(item => this.props.fetchBalance(
        this.props.account, item.token))
      //this.makeTotalAsset()

    }else if(prevProps.tokens != this.props.tokens) {
      console.log('token balance updated')
      // balance updated
      this.makeTotalAsset()
    }

    if(prevProps.market != this.props.market) {
      this.makeTotalAsset()
    }
  }

  /**
   * 计算总资产
   */
  makeTotalAsset = () => {
    let total = 0.00
    let markets = this.props.market.data
    if(markets.length <= 0) {
      return
    }
    this.props.tokens.map(item => {
      market = markets.filter(i => i.symbol == item.token)[0]
      let price = market ? parseFloat(market.price_cny) : 0.00
      total += parseFloat(item.balance) * price
    })
    this.props.updateAsset(total.toFixed(2))
  }

  /**
   * refresh
   */
  _onRefresh = () => {
    this.setState({refreshing:true})
    this.props.tokens.map(item => this.props.fetchBalance(
      this.props.account, item.token))
    //this.makeTotalAsset()
    this.setState({refreshing:false})
  }

  /**
   * scanner
   */
  onScanner = () => {
    this.setState({popShow:false})
    this.props.navigation.navigate('Scanner')
  }

  _renderHeader = () => (
    <View style={styles.header}>
      <View style={{flex:1}}>
        <Text style={{color:'white',marginRight:10,fontSize:18}}>付否</Text>
      </View>
      <TouchableOpacity style={{width:30,marginRight:30}} onPress={()=>{this.props.navigation.navigate('CoinList');this.setState({popShow:false})}}>
        <Icon name='plus' size={26} color='white' />
      </TouchableOpacity>
      <TouchableOpacity style={{width:30}} onPress={this.onScanner}>
        <Icon name='maximize' size={26} color='white' />
        {/* <Image source={require('./../images/maximize.png')} style={{height:26,width:26}}></Image> */}
      </TouchableOpacity>
    </View>
  )

  _renderPop = () =>{
    return(
      <View style={{height:'100%',width:'100%',position:'absolute',zIndex:9999}}>
          <TouchableOpacity  onPress={()=>{this.setState({popShow:false})}} style={{position:'absolute',zIndex:0,height:'100%',width:'100%'}}></TouchableOpacity>
          <ImageBackground
            style={{height:90,width:140,position:'absolute',top:Platform.OS === 'ios' ? 78 : 36,right:10}}
            source={require('../images/pop-up.png')}
            imageStyle={{width:140,height:90}}>
              <TouchableOpacity  onPress={()=>{this.props.navigation.navigate('CoinList');this.setState({popShow:false})}} style={{padding:6,paddingLeft:25,marginTop:14,display:'flex',flexDirection:'row'}}>
                <Icon name='plus' size={20} color='#808080' />
                <Text style={{flex:1,lineHeight:20,paddingLeft:5,color:'#808080'}}>添加资产</Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.onScanner} style={{padding:6,paddingLeft:25,marginTop:6,display:'flex',flexDirection:'row'}}>
                <Icon name='maximize' size={20} color='#808080' />
                <Text style={{flex:1,lineHeight:20,paddingLeft:5,color:'#808080'}}>扫一扫</Text>
              </TouchableOpacity>
          </ImageBackground>
      </View>
    )
  }

  _renderMain = () => {
    let image = new Identicon(this.props.account, {size:420,background: [255, 255, 255]}).toString()
    return (
      <ImageBackground
        source={require('../images/log-bg.png')}
        imageStyle={{width:'100%',height:'70%',opacity:0.3}}
        resizeMode={'stretch'}
        style={styles.main}>
        <View style={{padding:20}}>
          <View style={styles.mainTitle}>
            <Image
              source={{uri:'data:image/png;base64,'+image}}
              style={{width:32,height:32,borderRadius:5}} />
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={styles.mainCNY}>CNY</Text>
            <Text style={styles.mainBalance}>{this.props.asset}</Text>
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

  /**
   * render single token
   */
  _renderItem = ({item, index}) => {
    let coinmarket
    if(this.props.market.data)
      coinmarket = this.props.market.data.filter(
        i => i.symbol == item.token)[0]
    let price = 0.00
    let asset = 0.00

    if(coinmarket) {
      price = parseFloat(coinmarket.price_cny).toFixed(2)
      asset = parseFloat(coinmarket.price_cny * item.balance).toFixed(2)
    }
    return(
      <TouchableOpacity
        onPress={()=>this.props.navigation.navigate('Coin',
          {coin:item.token})}>
        <View style={styles.item}>
          <Image
            source={imageUrl[item.token]}
            style={{width:26,height:26,borderRadius:5,marginRight:10}} />
          <View style={{flex:80}}>
            <Text style={{color:'rgb(81,81,114)',fontSize:18,height:20,marginBottom:6}}>{item.token}</Text>
            <Text style={{color:'#999999',fontSize:12,height:14}}>{price} CNY</Text>
          </View>
          <View style={{alignItems:'flex-end',flex:60}}>

          </View>
          <View style={{alignItems:'flex-end',flex:80}}>
            <Text style={{color:'rgb(81,81,114)',fontSize:18,height:20,marginBottom:6}}>{parseFloat(item.balance).toFixed(4)}</Text>
            <Text style={{fontSize:12,color:'#999999',height:14}}>≈{asset} CNY</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderEmpty = () => (
    <View>Empty</View>
  )

  _renderToken() {
    return (
      <FlatList
        style={{paddingHorizontal:15}}
        data={this.props.tokens}
        keyExtractor={(item,i) => i.toString()}
        renderItem={this._renderItem}
        extraData={this.state, this.props}
        emptyComponent={this._renderEmpty}
      />
    )
  }

  render() {
    return (
      <View style={{backgroundColor:'#f6f7fb'}}>
        <ImageBackground
          source={require('../images/wallet-bg.png')}
          imageStyle={{width:width,height:width*5/6}}
          style={{width:'100%',height:'100%'}}>
          {this._renderHeader()}
          {this.state.popShow?this._renderPop():<View></View>}
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
import IphoneX from './../reducers/isIphoneX'
const styles = StyleSheet.create({
  header: {
    height:54,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:15,
    justifyContent:'space-between',
    ...IphoneX.ifIphoneX({
      marginTop: 44
    }, {
      marginTop: Platform.OS === 'ios' ? 20 : 0,
    })
  },
  mainTitle: {
    marginBottom:15,
    height:46,
    width:46,
    borderRadius:23,
    borderWidth:1,
    borderColor:'#f0f0f0',
    alignItems:'center',
    justifyContent:'center'
  },
  mainCNY: {
    marginRight:10,
    backgroundColor:'#eeaa3c',
    borderRadius:4,
    overflow:'hidden',
    paddingVertical:2,
    paddingHorizontal:6,
    fontSize:16,
    fontWeight:'bold',
    color:'white'
  },
  mainBalance: {
    fontSize:28,
    color:'rgb(81,81,114)',
    fontWeight:'200'
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
    paddingVertical:12,
    paddingHorizontal:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius:5
  }
})

const mapStateToProps = state => {
  return {
    account: state.account.address,
    market: state.market,
    tokens: state.tokens,
    asset: state.account.asset
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddToken: token => dispatch(addToken(token)),
    fetchBalance: (address, token) => dispatch(fetchBalance(address, token)),
    updateAsset: (data) => dispatch(updateAsset(data))
  }
}

WalletScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WalletScreen)

export default WalletScreen
