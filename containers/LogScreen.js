import React, {Component} from 'react'
import {RefreshControl, ActivityIndicator,Dimensions,ImageBackground, Alert, AsyncStorage,StyleSheet, TouchableOpacity, FlatList, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'
import {getBalance, formatTime,getCoinsValData} from '../utils'
import { deflate } from 'zlib';

const Web3 = require('web3')
let web3 = new Web3('http://47.94.206.167:8545');

const apikey = 'G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W'
const url = 'https://api.etherscan.io/api'

export default class LogScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('token')
  })

  constructor(props) {
    super(props)
    this.state = {
      token: null,
      account: null,
      balance: 0.0000,
      logs: [],
      fetching: true,
      refreshing: false,
      coinNum:20,
      coinTran:1,
      txreceipt_status:'交易完成'
    }
  }

  componentDidMount() {
    this.setState({token: this.props.navigation.getParam('token')})
    this._getCoinsValData(this.props.navigation.getParam('token'))
    this._getAccount()
  }

  _getCoinsValData = (coins) => {
    let url = `http://bplus.bijia666.com/index.php/getPriceByCoinName?coin=`+coins
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': 'afa301a7-3f5d-4694-b87c-eb48e6e07cc8'
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          coinTran:responseJson.data
        })
      })
      .catch((error) => console.log(error))
  }

  // 获取账户
  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account.toLowerCase()})
    this._getBalance()
    this._fetchLog()
  }

  // 获取资产
  _getBalance() {
    //this.setState({balance: getBalance(this.state.account, this.state.token)})
    web3.eth.getBalance(this.state.account).then(res => this.setState({balance: web3.utils.fromWei(res, 'ether')}))
  }

  _onRefresh = () => {
    this.setState({refreching:true})
    this._fetchLog().then(()=>this.setState({refreshing:false}))
  }

  // 获取交易记录
  _fetchLog = () => {
    let curl = url + `?module=account&action=txlist&address=${this.state.account}&startblock=0&endblock=99999999&sort=desc&apikey=${apikey}`
    return fetch(curl)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        if(responseJson.status == '1') {
          this.setState({logs:responseJson.result})
        } else {
          Alert.alert(responseJson.message)
        }
        this.setState({fetching:false})
      })
      .catch((error) => {
        this.setState({fetching:false})
        Alert.alert(error.toString())
      })
  }

  _filterShort(str) {
    return str.substr(0,7)+'...'+str.substr(-7)
  }

  _setState = (state)=>{
    switch(state){
      case '0':
      return '打包失败'
      case '1':
      return ''
      case '2':
      return '打包中'
    }
  }

  _keyExtractor = (item,i) => i.toString()

  // //列表倒序
  // _reverse = (obj) => {
  //   let arr = []
  //   for(let i in obj){
  //     arr.push(obj[i])
  //   }
  //   for (let i in obj) {
  //     obj[i] = arr[obj.length-1-i]
  //   }
  //   return obj;
  // }

  _renderHeader = () => (
      <ImageBackground source={require('../images/log-bg.png')}
        imageStyle={{}}
        style={{height:140,flexDirection:'row',justifyContent:'center',}}>
        <View style={{alignSelf:'center'}}>
          <Text style={{fontSize:28,alignSelf:'center'}}>
            {this.state.balance}</Text>
          <Text style={{fontSize:16,alignSelf:'center'}}>
            ≈¥{(this.state.balance*this.state.coinTran).toFixed(2)}
            </Text>
        </View>
      </ImageBackground>
  )

  // 单条记录
  _renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.logContainer}
      onPress={()=>this.props.navigation.navigate('Detail',
      {hash:item.hash})}>
      <View style={{height:'100%',width:4,backgroundColor:this.state.account==item.from?'#e40006':'#499f04',position:'absolute',marginTop:10,borderTopRightRadius:4,borderBottomRightRadius:4}}></View>
      <View>
        <Text style={styles.logTitle}>
          {this._filterShort(this.state.account==item.from?item.to:item.from)}</Text>
        <Text style={styles.logDate}>
          {formatTime(item.timeStamp)}</Text>
      </View>
      <View>
        <Text style={this.state.account==item.from?styles.logBalanceOrange:styles.logBalanceBlue}>
          {this.state.account==item.from? '-':'+'}
          {web3.utils.fromWei(item.value, 'ether')+' ether'}</Text>
        <Text style={styles.logStatus}>
          {this._setState(item.txreceipt_status)}</Text>
      </View>
    </TouchableOpacity>
  )

  // 空
  _renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name='moon' size={80} color={colors.secondary} />
      <Text style={{color:colors.darkgrey,marginTop:20}}>这里什么也没有</Text>
    </View>
  )

  // 底部按钮
  _renderFooter = () => (
    <View style={{height:46,display:'flex',flexDirection:'row'}}>
      <TouchableOpacity
        style={{flex:1,backgroundColor:'#212b66'}}
        onPress={()=>this.props.navigation.navigate('Transfer',
        {token:this.state.token})}>
        <View style={{alignItems:'center',justifyContent:'center',height:42}}>
          <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>
            转  账</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flex:1,backgroundColor:'#27337d'}}
        onPress={()=>this.props.navigation.navigate('Receipt')}>
        <View style={{alignItems:'center',justifyContent:'center',height:42}}>
          <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>
            收  款</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  render() {
    return (
      <View style={{flex:1}}>
        {this._renderHeader()}
        {/* <StatusBar translucent={false} barStyle='dark-content' /> */}
        {!this.state.fetching ? (
          <FlatList
            style={{paddingTop:10,paddingBottom:10}}
            data={this.state.logs}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshControl={
            <RefreshControl
              onRefresh={this._onRefresh}
              refreshing={this.state.refreshing} />
            }
            ListEmptyComponent={this._renderEmpty}
          />
        ) : (
          <View style={{flex:1,justifyContent:'center'}}>
            <ActivityIndicator />
          </View>
        )}

        {this._renderFooter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {

  },
  logContainer: {
    flex:1,
    backgroundColor:'white',
    position:'relative',
    margin:15,
    borderRadius:3
    ,marginTop:2,
    marginBottom:8,
    padding:15,
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  logTitle: {
    color:colors.dark,
    fontSize:14,
    lineHeight:20
  },
  logDate: {
    color:colors.lightgrey,
    fontSize:12,
    lineHeight:20
  },
  logBalanceOrange: {
    fontSize:14,
    lineHeight:20,
    color:'#ff9b00'
  },
  logBalanceBlue: {
    fontSize:14,
    lineHeight:20,
    color:'#212b66'
  },
  logStatus: {
    color:colors.lightgrey,
    textAlign:'right',
    fontSize:12,
    lineHeight:20
  },
  emptyContainer: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginTop:50
  }
})
