import React, {Component} from 'react'
import {WebView, View, Text} from 'react-native'
import api from '../api'

const url = api.income

export default class FinanceScreen extends Component {
  static navigationOptions = {
    title: '理财收益'
  }

  render() {
    return (
      <WebView
        startInLoadingState={true}
        onError={(err)=>{
          console.log(err)
        }}
        source={{uri:url}} />
    )
  }
}
