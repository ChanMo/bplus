import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import { formatAddress, formatTime } from '../utils'

export default class LogItem extends Component {

  render() {
    const data = this.props.data
    const isSend = this.props.account.toLowerCase() == data.from.toLowerCase()
    let color
    if((data.status == 4 || data.confirmation == 24)
      && isSend) {
      color = '#e40006'
    } else if ((data.status == 4 || data.confirmation == 24)
      && !isSend) {
      color = '#499f04'
    } else {
      color = '#f3b05d'
    }
    let status
    if(data.status in [1,2]) {
      status = '等待打包'
    } else if (data.confirmation == 24) {
      status = null
    } else if (data.status == 3) {
      status = '打包中'
    }
    return (
      <TouchableOpacity
        style={styles.logContainer}
        onPress={this.props.onPress}>
        <View style={[styles.left,{backgroundColor:color}]}>
        </View>
        <View>
          <Text style={styles.logTitle}>
            {formatAddress(isSend?data.to:data.from)}
          </Text>
          <Text style={styles.logDate}>
            {formatTime(data.timestamp)}
          </Text>
        </View>
        <View>
          <Text style={isSend?styles.logBalanceOrange:styles.logBalanceBlue}>
            {isSend?'-':'+'}
            {data.value}</Text>
          <Text style={styles.logStatus}>{status}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  logContainer: {
    flex:1,
    backgroundColor:'white',
    position:'relative',
    borderRadius:3,
    marginTop:8,
    marginLeft:15,
    marginRight:15,
    padding:15,
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  left: {
    height:'70%',
    width:4,
    position:'absolute',
    marginTop:10,
    borderTopRightRadius:4,
    borderBottomRightRadius:4,
    top:'15%'
  },
  logTitle: {
    color:'#3a3a3a',
    fontSize:14,
    lineHeight:20
  },
  logDate: {
    color:'#b2b2b2',
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
    color:'#b2b2b2',
    textAlign:'right',
    fontSize:12,
    lineHeight:20
  },
})
