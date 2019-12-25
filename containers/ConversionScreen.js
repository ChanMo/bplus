import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import Button from '../components/Button'

class ConversionScreen extends Component {

  static navigationOptions = {
    title: '闪兑'
  }

  constructor(props) {
    super(props)
    this.state = {
      valueFrom: 1,
      valueTo: 1,
      rate: 1,
    }
  }

  _renderNotice = () => (
    <View style={styles.notice}>
      <Text>!闪兑服务说明</Text>
    </View>
  )

  _renderHistory = () => (
    <View style={styles.history}>
      <TouchableOpacity
        onPress={()=>this.props.navigation.navigate('Web', {
          link:'http://www.baidu.com'})
        }>
        <Text>操作历史</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        {this._renderNotice()}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(valueFrom)=>this.setState({valueFrom})}
            value={this.state.valueFrom.toString()} />
          <Text>ETH(可用:0.1)</Text>
        </View>
        <View style={styles.rate}>
          <Text>当前费率: {this.state.rate}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(valueTo)=>this.setState({valueTo})}
            value={this.state.valueTo.toString()} />
          <Text>YLC</Text>
        </View>
        <Button
          onPress={()=>null}
          title="提交" />
        {this._renderHistory()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'white',
    padding:15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  rate: {
    marginBottom: 15,
  },
  notice: {
    backgroundColor: '#FFE8EE',
    marginBottom: 15,
    padding: 10,
    color: 'pink'
  },
  history: {
    marginVertical: 15,
    alignItems: 'center'
  }
})

export default connect()(ConversionScreen)
