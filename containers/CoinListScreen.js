import React, {Component} from 'react'
import {FlatList, View, Text, Image, Switch} from 'react-native'
import { connect } from 'react-redux'
import { addToken, removeToken } from '../actions'

import tokens from './../tokens'
import imageUrl from './../imageUrl'

class CoinListScreen extends Component {
  static navigationOptions = {
    title: '管理币种',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      coins: null
    }
  }

  componentDidMount() {
    this._getCoins()
  }

  _getCoins = async() => {
    this.setState({coins:Object.values(tokens)})
  }

  /**
   * 添加,删除tokens
   */
  _setMyCoins(coin, value) {
    if(value) {
      this.props.onAddToken(coin)
    } else {
      this.props.onRemoveToken(coin)
    }
  }

  _keyExtractor = (item,i) => i.toString()
  _renderItem = ({item}) => {
    return (
      <View style={{flexDirection:'row',alignItems:'center',padding:15,backgroundColor:'#f6f7fb',marginBottom:1}}>
        <Image defaultSource={require('./../images/logo.png')} source={imageUrl[item.name]} style={{width:32,height:32}} />
        <View style={{paddingHorizontal:10,flex:1}}>
          <View><Text style={{fontSize:16,color:'#000000'}}>{item.name}</Text></View>
          <View><Text style={{color:'grey'}}>{item.name}</Text></View>
        </View>
        {item.symbol !== 'ETH' &&<Switch
          onValueChange={(value)=>this._setMyCoins(item.name, value)}
          value={this.props.tokens.some(i => i.token == item.name)} />}
      </View>
    )
  }

  render() {
    const tokens = this.props.tokens
    return (
      <FlatList
        data={this.state.coins}
        keyExtractor={this._keyExtractor}
        extraData={this.state, this.props}
        renderItem={this._renderItem}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    tokens: state.tokens
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddToken: token => dispatch(addToken(token)),
    onRemoveToken: token => dispatch(removeToken(token))
  }
}

CoinListScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinListScreen)
export default CoinListScreen
