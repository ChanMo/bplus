import React, {Component} from 'react'
import {Button as EButton} from 'react-native-elements'

export default class Button extends Component {
  render() {
    return (
      <EButton
        {...this.props}
        buttonStyle={{
          backgroundColor:'#6ab04c',
        }}
      />
    )
  }
}
