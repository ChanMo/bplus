import React, {Component} from 'react'
import {RefreshControl, ActivityIndicator,Dimensions,ImageBackground, Alert, AsyncStorage,StyleSheet, TouchableOpacity, FlatList, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../colors'
import {formatTime} from '../utils'

const apikey = 'G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W'
const url = 'https://api.etherscan.io/api'

export default class LogScreen extends Component {
  static navigationOptions = {
    title: "ETH"
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      logs: [{from:'1',to:'2',timeStamp:'1111',value:'1000000'}],
      fetching: true,
      refreshing: false
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
        // Alert.alert(responseJson)
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

  _keyExtractor = (item,i) => i.toString()

  _renderHeader = () => (
      <ImageBackground source={require('../images/log-bg.png')}
        imageStyle={{}}
        style={{height:140,lexDirection:'row',justifyContent:'center',}}>
        <View style={{alignSelf:'center'}}>
          <Text style={{fontSize:28,alignSelf:'center'}}>1.32</Text>
          <Text style={{fontSize:16,alignSelf:'center'}}>≈¥1384.33</Text>
        </View>
      </ImageBackground>
      
  )

  _renderItem = ({item, index}) => (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Detail')} style={{flex:1,backgroundColor:'white',margin:15,borderRadius:3,marginTop:2,marginBottom:8,padding:15,paddingTop:10,paddingBottom:10,flexDirection:'row',justifyContent:'space-between'}}>
      <View>
        <Text style={{color:colors.dark,fontSize:14,lineHeight:20}}>from:{this._filterShort(item.from)}</Text>
        <Text style={{color:colors.lightgrey,lfontSize:12,ineHeight:20}}>{formatTime(item.timeStamp)}</Text>
      </View>
      <View>
        <Text style={{color:colors.dark,fontSize:14,lineHeight:20,color:'#ff9b00'}}>{web3.utils.fromWei(item.value, 'ether')+' ether'}</Text>
        <Text style={{color:colors.lightgrey,textAlign:'right',fontSize:12,lineHeight:20}}>{item.txreceipt_status}</Text>
        {/* <Text style={index%2 ? styles.style1: styles.style2}>Hello</Text> */}
      </View>
    </TouchableOpacity>
  )

  _renderEmpty = () => (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:50}}>
      <Icon name='moon' size={80} color={colors.secondary} />
      <Text style={{color:colors.darkgrey,marginTop:20}}>这里什么也没有</Text>
    </View>
  )

  _renderFooter = () => (
    <View style={{height:46,display:'flex',flexDirection:'row'}}>
      <TouchableOpacity style={{flex:1,backgroundColor:'#212b66'}} onPress={()=>this.props.navigation.navigate('Transfer')}>
        <View style={{alignItems:'center',justifyContent:'center',height:42}}>
            <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>转  账</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{flex:1,backgroundColor:'#27337d'}} onPress={()=>this.props.navigation.navigate('Receipt')}>
        <View style={{alignItems:'center',justifyContent:'center',height:42}}>
            <Text style={{fontSize:14,color:'#ffffff',alignSelf:'center'}}>收  款</Text>
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
          <ActivityIndicator style={{marginTop:50}} />
        )}

        {this._renderFooter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  style1: {
    color: 'red',
  },
  style2: {
    color: 'blue',
  }
})
