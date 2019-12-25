import React, {Component} from 'react'
import {WebView, View, Text} from 'react-native'

const url = 'http://bplus.mocapital.top'

export default class FinanceScreen extends Component {
  static navigationOptions = {
    title: '理财',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }

  render() {
    return (
      <WebView
        startInLoadingState={true}
        source={{uri:url}} />
    )
  }
}
