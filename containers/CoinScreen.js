import React, { Component } from 'react'
import {
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ImageBackground,
  View,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import { checkPending, fetchBalance, fetchLog, clearPending } from '../actions'
import { LogItem, Empty, Button } from '../components'

class CoinScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('coin', 'ETH'),
    headerStyle:{
      borderBottomWidth:0,
      shadowOpacity:0,
      elevation:0,
    }
  })

  constructor(props) {
    super(props)
    this.state = {
      coin: props.navigation.getParam('coin', 'ETH'),
      balance: 0.0000,
      price: 0.00,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.props.checkPending(this.props.pending)
    this.props.fetchBalance(this.props.account, this.state.token)
    this.props.clearPending()
    const pending = this.props.pending.filter(
      item=>item.token == this.state.coin)
    this.props.fetchLog(
      this.props.account,
      this.state.coin,
      1,
      10-pending.length
    )
  }

  componentWillUnmount() {
    this.props.clearPending()
  }

  /**
   * 刷新
   */
  _onRefresh = () => {
    this.setState({refreching:true})
    this.props.checkPending(this.props.pending)
    this.props.fetchBalance(this.props.account, this.state.coin)
    this.props.fetchLog(this.props.account, this.state.coin, 1, 10)
    this.props.clearPending()
    this.setState({refreshing: false})
  }

  /**
   * get makret
   */
  _getMarket = () => {
    let market = this.props.market.filter(
      item => item.symbol == this.state.coin)[0]
    return market ? market.price_cny : 0.00
  }

  /**
   * get balance
   */
  _getBalance = () => {
    let coin = this.props.tokens.filter(
      item => item.token == this.state.coin)[0]
    return coin ? coin.balance.toFixed(4) : 0.0000
  }

  _keyExtractor = (item,i) => i.toString()

  /**
   * render header
   */
  _renderHeader = () => {
    let price = this._getMarket()
    let balance = this._getBalance()
    let amount = (price * balance).toFixed(2)
    return (
      <ImageBackground
        source={require('../images/wat.png')}
        imageStyle={{width:'100%'}}
        resizeMode={'stretch'}
        style={styles.header}>
        <Text style={styles.headerTitle}>{balance}</Text>
        <Text style={styles.headerSubTitle}>≈¥{amount}</Text>
      </ImageBackground>
    )
  }

  _renderItem = ({item}) => {
    let data = {
      'hash': item.hash,
      'from': item.from,
      'to': item.to,
      'value': parseFloat(web3.utils.fromWei(item.value)).toFixed(4),
      'timestamp': item.timeStamp ? item.timeStamp : item.timestamp,
      'status': item.status ? item.status : 4,
      'confirmation': item.confirmation
    }
    return <LogItem
      onPress={()=>this.props.navigation.navigate(
        'Detail', {hash:item.hash})}
      account={this.props.account}
      data={data} />
  }

  _renderEmpty = () => (
    <Empty
      style={{marginTop:100}}
      text={'暂无交易记录'}
    />
  )

  /**
   * render log
   */
  _renderLog = () => {
    let data = this.props.pending.filter(
      item=>item.token == this.state.coin)
    data = data.concat(this.props.log.data)
    return (
      <FlatList
        style={{flex:1,paddingBottom:10}}
        data={data}
        extraData={this.state, this.props}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmpty}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  /**
   * render action
   */
  _renderFooter= () => {
    if(this.props.log.data.length > 0) {
      return (
        <TouchableOpacity
          onPress={()=>this.props.navigation.navigate('Log',
            {coin:this.state.coin})}
          style={{marginVertical:20,alignItems:'center'}}>
          <Text>查看全部</Text>
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }

  /**
   * render footer
   */
  _renderAction = () => (
    <View style={{height:46,display:'flex',flexDirection:'row'}}>
      <TouchableOpacity
        style={{flex:1,backgroundColor:'#212b66'}}
        onPress={()=>this.props.navigation.navigate('Transfer',
        {token:this.state.coin})}>
        <View style={{alignItems:'center',justifyContent:'center',height:42}}>
          <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>
            转 账</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flex:1,backgroundColor:'#27337d'}}
        onPress={()=>this.props.navigation.navigate('Receipt')}>
        <View style={{alignItems:'center',justifyContent:'center',height:42}}>
          <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>
            收 款</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  render() {
    return (
      <View
        style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {this._renderHeader()}
          {this.props.log.fetching ? (
            <View style={{flex:1,marginTop:50,justifyContent:'center'}}>
              <ActivityIndicator />
            </View>
          ) : this._renderLog()}
        </ScrollView>
        {this._renderAction()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#f6f7fb'
  },
  header: {
    backgroundColor:'#262f6c',
    height:190,
    justifyContent:'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize:30,
    color:'white'
  },
  headerSubTitle: {
    fontSize:16,
    color:'white'
  }
})

const mapStateToProps = state => {
  return {
    account: state.account.address,
    tokens: state.tokens,
    market: state.market.data,
    pending: state.pending,
    log: state.log
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkPending: (data) => dispatch(checkPending(data)),
    fetchBalance: (account, token) => dispatch(
      fetchBalance(account, token)),
    fetchLog: (account, coin, page, offset) => dispatch(
      fetchLog(account, coin, page, offset)),
    clearPending: () => dispatch(clearPending())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinScreen)
