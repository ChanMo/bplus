import React, {Component} from 'react'
import {RefreshControl, ActivityIndicator,DeviceEventEmitter,ScrollView,Dimensions,ImageBackground, Alert, AsyncStorage,StyleSheet, TouchableOpacity, FlatList, View, Text,Image} from 'react-native'
import { connect } from 'react-redux'
import { fetchBalance, fetchLog, clearPending } from '../actions'
import { LogItem, Empty, Button } from '../components'

class LogScreen extends Component {
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
      coin: props.navigation.getParam('coin', 'ETH'), // token名字
      data: [],
      page: 1,
      end: false
    }
  }

  componentWillMount() {
    this.props.fetchLog(this.props.account, this.state.coin, this.state.page, 20)
    this.setState({page:this.state.page+1})
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.log.fetching != this.props.log.fetching
      && this.props.log.fetching == false) {
      if(this.props.log.data.length > 0) {
        let data = this.state.data.concat(this.props.log.data)
        this.setState({
          data: data,
          end: this.props.log.data.length < 20
        })
      } else {
        this.setState({end: true})
      }
    }
  }

  componentWillUnmount() {
    this.props.fetchLog(this.props.account, this.state.coin, 1, 10)
  }

  _isReached = () => {
    if(this.state.end || this.props.log.fetching) {
      return
    }
    console.log('page',this.state.page)
    this.props.fetchLog(this.props.account, this.state.coin, this.state.page, 20)
    this.setState({page:this.state.page+1})
  }

  /**
   * render item
   */
  _renderItem = ({item}) => {
    let data = {
      'hash': item.hash,
      'from': item.from,
      'to': item.to,
      'value': parseFloat(web3.utils.fromWei(item.value)).toFixed(4),
      'timestamp': item.timeStamp ? item.timeStamp : item.timestamp,
      'status': item.status ? item.status : 4
    }
    return <LogItem
      onPress={()=>this.props.navigation.navigate(
        'Detail', {hash:item.hash})}
      account={this.props.account}
      data={data} />
  }

  _keyExtractor = (item,i) => i.toString()

  /**
   * render empty
   */
  _renderEmpty = () => (
    <Empty text={'暂无交易记录'} />
  )

  /**
   * render list footer
   */
  _renderFooter = () => {
    if(this.props.log.fetching) {
      return (
        <Text style={styles.footerText}>加载中...</Text>
      )
    } else if(this.state.end) {
      return (
        <Text style={styles.footerText}>没有更多了</Text>
      )
    } else {
      return null
    }
  }

  render() {
    if(this.state.page == 2 && this.props.log.fetching) {
      return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <FlatList
        style={{flex:1}}
        data={this.state.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmpty}
        ListFooterComponent={this._renderFooter}
        onEndReached={this._isReached}
      />
    )
  }
}

const styles = StyleSheet.create({
  footerText: {
    marginVertical: 20,
    textAlign: 'center',
    color: '#666666'
  }
})

const mapStateToProps = state => {
  return {
    account: state.account.address,
    eth: state.account.balance,
    tokens: state.tokens,
    market: state.market.data,
    pending: state.pending,
    log: state.log
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchBalance: (account, token) => dispatch(
      fetchBalance(account, token)),
    fetchLog: (account, coin, page, offset) => dispatch(
      fetchLog(account, coin, page, offset)),
    clearPending: () => dispatch(clearPending())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogScreen)
