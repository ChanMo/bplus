import React, {Component} from 'react'
import {StatusBar, FlatList, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'

export default class LogScreen extends Component {
  static navigationOptions = {
    title: '交易记录'
  }

  constructor(props) {
    super(props)
    this.state = {
      logs: []
    }
    this._fetchLog()
  }

  _fetchLog = () => {
    let url = 'http://47.94.206.167:8545'
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{
          fromBlock: 'latest'
        }],
        id: 1
      })
    }).then((response) => response.json())
      .then((responseJson) => this.setState({
        logs: responseJson.result
      }))
      .catch((error) => console.log('节点异常'))
  }

  _filterShort(str) {
    return str.substr(0,7)+'...'+str.substr(-7)
  }

  _keyExtractor = (item,i) => i.toString()

  _renderItem = ({item}) => (
    <View style={{flex:1,backgroundColor:'white',marginBottom:1,padding:15,flexDirection:'row',justifyContent:'space-between'}}>
      <View>
        <Text style={{color:colors.dark,fontSize:16}}>{this._filterShort(item.address)}</Text>
        <Text style={{color:colors.lightgrey}}>2018/08/20 20:20:00</Text>
      </View>
      <Text style={{color:colors.dark,fontSize:16}}>0.100</Text>
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
