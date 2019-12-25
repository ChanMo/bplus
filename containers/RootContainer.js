import React, { Component } from 'react'
import { Alert } from 'react-native'
import PushNotification from 'react-native-push-notification';
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import { fetchMarket, fetchBalance, checkPending } from '../actions'
import MainStack from '../navigation'
import runService from '../service'

//const Web3 = require('web3')
//let web3 = new Web3('wss://mainnet.infura.io/ws/v3/c5ecf0f3fad2436e94fa74e57b0f4c50');
//let web3 = new Web3('ws://47.244.0.145:8546');

//import tokens from '../tokens'

class RootContainer extends Component {
  subscriptions = []

  componentDidMount() {
    this.props.checkPending(this.props.pending)
    //if (this.props.account) {
    //  this.subscriptionEth = this.subscribeEth()
    //  this.multiSubscribe(this.props.tokens.filter(item => item != 'ETH'))
    //  //this.subscribeLog()
    //}
    //
    this.props.fetchMarket(this.props.config.market)
    this.setInterval(()=>{
      runService()
      if(this.props.account && this.props.config.market) {
        this.props.fetchMarket(this.props.config.market)
      }
    }, 15000)
  }

  componentDidUpdate(prevProps, prevState) {
    //if(prevProps.account !== this.props.account
    //  && !this.props.account) {
    //  this.subscriptionEth.unsubscribe((error,success)=>console.log(success))
    //}
    //if(prevProps.tokens !== this.props.tokens) {
    //  if(this.props.tokens.length > prevProps.tokens.length) {
    //    // add token
    //    let tokens = this.props.tokens.filter(item => prevProps.tokens.indexOf(item) < 0)
    //    this.multiSubscribe(tokens)
    //  } else {
    //    // remove token
    //    let tokens = prevProps.tokens.filter(item => this.props.tokens.indexOf(item) < 0)
    //    this.multiUnsubscribe(tokens)
    //  }
    //}
  }

  componentWillUmount() {
    web3.eth.clearSubscriptions()
  }

  /**
   * 批量关注
   */
  multiSubscribe = (tokens) => {
    console.log('add tokens: ', tokens)
    tokens.map(item => {
      if(!this.subscriptions.some(i => i.token == item)) {
        this.subscriptions.push({
          'token':item,
          'subscription':this.subscribeToken(item)
        })
      }
    })
    console.log(this.subscriptions.map(item => item.token))
  }


  /**
   * 批量取消关注
   */
  multiUnsubscribe = (tokens) => {
    let subscriptions_copy = this.subscriptions
    this.subscriptions.map(item => {
      if(tokens.indexOf(item.token) > -1) {
        console.log(item.subscription.id)
        if(item.subscription.id) {
          item.subscription.unsubscribe((error,success)=>console.log('remove success'))
          subscriptions_copy = subscriptions_copy.filter(item => item.token)
        }
      }
    })
    this.subscriptions = subscriptions_copy
  }

  /**
   * 监听log
   */
  subscribeLog = () => {
    console.log('start subscribe logs')
    web3.eth.subscribe('logs', {
      address: this.props.account
      //topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
    }, function(error, result){
      console.log('subscribe log', error, result)
    })
      .on("data", (log)=>console.log(log))
      .on("changed", (log)=>null)
  }

  /**
   * 监听账户log服务
   */
  subscribeEth = () => {
    const self = this
    console.log('start subscribe eth')
    return web3.eth.subscribe('pendingTransactions',
      (error,result)=>{if(error)console.log(error)})
      .on("data", (transaction) => {
        web3.eth.getTransaction(transaction).then(res=>{
          if(res && res.to == this.props.account) {
            self.pushNotif('ETH', res.value, res)
          } else if(res && res.from == this.props.account) {
            self.pushSendNotif()
          }
        })
        //web3.eth.getTransactionReceipt(transaction).then(res=>{
        //  console.log('receipt: ', res)
        //})
      }).on("error", (error)=>console.log('subscribe Eth error', error))
  }

  /**
   * subscribe tokens
   */
  subscribeToken = (token) => {
    const self = this
    console.log('start subscribe token ', token)
    const tokenData = tokens[token]
    const contract = new web3.eth.Contract(JSON.parse(tokenData.abi), tokenData.address)
    return contract.events.Transfer({filter:{to:this.props.account}})
      .on("data", (data)=>self.pushNotif(token, data.returnValues.value, data))
      .on("error", (error)=>console.log('subscribe token error', error))
  }

  /**
   * push notif
   */
  pushNotif = (token, count, data) => {
    console.log(data)
    count = web3.utils.fromWei(count)
    PushNotification.localNotification({
      title: "收款通知",
      message: `${count}${token.toLowerCase()} 收款成功`
    })
  }

  pushSendNotif = () => {
    PushNotification.localNotification({
      title: "转帐通知",
      message: `转账成功`
    })
  }

  render() {
    return (
      <MainStack />
    )
  }
}

reactMixin(RootContainer.prototype, TimerMixin)

const mapStateToProps = state => {
  return {
    config: state.config,
    account: state.account.address,
    tokens: state.tokens,
    pending: state.pending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMarket: (api) => dispatch(fetchMarket(api)),
    fetchBalance: (address) => dispatch(fetchBalance(address)),
    checkPending: (data) => dispatch(checkPending(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootContainer)
