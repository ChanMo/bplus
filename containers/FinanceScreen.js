import React, {Component} from 'react'
import {WebView, View, Text} from 'react-native'

const url = 'http://www.mocapital.top/bplus/bplus.html'

export default class FinanceScreen extends Component {
  static navigationOptions = {
    title: '理财'
  }

  render() {
    return (
      <WebView 
        source={{uri:url}} />
    )
  }
}
