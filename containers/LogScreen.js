import React, {Component} from 'react'
import {Alert, AsyncStorage, StatusBar, FlatList, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'

const apikey = 'G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W'
const url = 'https://api.etherscan.io/api'

function formatTime(timestamp) {
  let date = new Date(parseInt(timestamp)*1000)
  return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

export default class LogScreen extends Component {
  static navigationOptions = {
    title: '交易记录'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      logs: []
    }
  }

  componentDidMount() {
    this._getAccount()
  }

  _getAccount = async() => {
    const account = await AsyncStorage.getItem('account')
    this.setState({account:account})
    this._fetchLog()
  }

  _fetchLog = () => {
    let curl = url + `?module=account&action=txlist&address=${this.state.account}&startblock=0&endblock=99999999&sort=asc&apikey=${apikey}`
    console.log(curl)
    return fetch(curl)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status == '1') {
          this.setState({logs:responseJson.result})
        } else {
          Alert.alert(responseJson.message)
        }
      })
      .catch((error) => Alert.alert(error.toString()))
    //let url = 'http://47.94.206.167:8545'
    //return fetch(url, {
    //  method: 'POST',
    //  headers: {
    //    'Content-Type': 'application/json'
    //  },
    //  body: JSON.stringify({
    //    jsonrpc: '2.0',
    //    method: 'eth_getLogs',
    //    params: [{
    //      fromBlock: 'latest'
    //    }],
    //    id: 1
    //  })
    //}).then((response) => response.json())
    //  .then((responseJson) => this.setState({
    //    logs: responseJson.result
    //  }))
    //  .catch((error) => console.log('节点异常'))
  }

  _filterShort(str) {
    return str.substr(0,7)+'...'+str.substr(-7)
  }

  _keyExtractor = (item,i) => i.toString()

  _renderItem = ({item}) => (
    <View style={{flex:1,backgroundColor:'white',marginBottom:1,padding:15,flexDirection:'row',justifyContent:'space-between'}}>
      <View>
        <Text style={{color:colors.dark,fontSize:16}}>from:{this._filterShort(item.from)}</Text>
        <Text style={{color:colors.dark,fontSize:16}}>to:{this._filterShort(item.to)}</Text>
        <Text style={{color:colors.lightgrey}}>{formatTime(item.timeStamp)}</Text>
      </View>
      <Text style={{color:colors.dark,fontSize:16}}>{web3.utils.fromWei(item.value, 'ether')}</Text>
    </View>
  )

  _renderEmpty = () => (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:50}}>
      <Icon name='moon' size={80} color={colors.secondary} />
      <Text style={{color:colors.darkgrey,marginTop:20}}>这里什么也没有</Text>
    </View>
  )

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        <FlatList
          data={this.state.logs}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={this._renderEmpty}
        />
      </View>
    )
  }
}
