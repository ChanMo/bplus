import React, { Component } from 'react'
import { Dimensions, StyleSheet, View, Image, Text } from 'react-native'
const { width } = Dimensions.get('window')

export default class Empty extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Image
          source={require('./../images/no_record.png')}
          resizeMode='contain'
          style={{width:width/3.5,height:width/3.5}}></Image>
        {this.props.text && <Text style={styles.text}>{this.props.text}</Text>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  text: {
    color: '#808080',
    fontSize: 16
  }
})
