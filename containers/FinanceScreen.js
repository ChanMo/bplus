import React, {Component} from 'react'
import {WebView, View, Text} from 'react-native'

const url = 'http://bplus.mocapital.top'

export default class FinanceScreen extends Component {
  static navigationOptions = {
    title: '理财'
  }

  render() {
    return (
      <WebView
        startInLoadingState={true}
        source={{uri:url}} />
    )
  }
}
