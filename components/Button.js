import React, {Component} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native'

export default class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this._validation}
        {...this.props}>
        <ImageBackground
          style={styles.innerContainer}
          imageStyle={{height:42,alignItems:'center'}}
          source={require('../images/wallet-btn.png')}>
          <Text style={styles.text}>{this.props.title}</Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:5,
  },
  innerContainer: {
    height:42,
    alignItems:'center',
    justifyContent:'center'
  },
  text: {
    color:'white'
  }
})
