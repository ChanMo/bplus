import React, {Component} from 'react'
import {RefreshControl, ActivityIndicator, Alert, AsyncStorage, StatusBar, FlatList, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'
import {formatTime} from '../utils'

const apikey = 'G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W'
const url = 'https://api.etherscan.io/api'

export default class LogScreen extends Component {
  static navigationOptions = {
    title: '交易记录'
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      logs: [],
      fetching: true,
      refreshing: false,
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

  _onRefresh = () => {
    this.setState({refreching:true})
    this._fetchLog().then(()=>this.setState({refreshing:false}))
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
          //Alert.alert(responseJson.message)
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
        {!this.state.fetching ? (
          <FlatList
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
          <ActivityIndicator style={{marginTop:50}} />
        )}
      </View>
    )
  }
}
