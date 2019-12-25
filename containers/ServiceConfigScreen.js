import React, { Component } from 'react'
import { Alert, StyleSheet, View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { updateConfig } from '../actions'
import Button from '../components/Button'
import Toast from 'react-native-simple-toast'

class ServiceConfigScreen extends Component {
  static navigationOptions = {
    title: '服务设置'
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: props.config.web3,
      web3_wss: props.config.web3_wss,
      market: props.config.market
    }
  }

  onSubmit = () => {
    let data = {
      web3: this.state.web3,
      web3_wss: this.state.web3_wss,
      market: this.state.market
    }
    this.props.updateConfig(data)
    Toast.show('保存成功',1)
  }

  render() {
    return (
      <View
        style={styles.container}>
        <View
          style={[styles.inputContainer, {marginTop:15}]}>
          <Text
            style={styles.label}>https节点</Text>
          <TextInput
            value={this.state.web3}
            onChangeText={(web3)=>this.setState({web3})}
            style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text
            style={styles.label}>websocks节点</Text>
          <TextInput
            value={this.state.web3_wss}
            onChangeText={(web3_wss)=>this.setState({web3_wss})}
            style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text
            style={styles.label}>market接口</Text>
          <TextInput
            value={this.state.market}
            onChangeText={(market)=>this.setState({market})}
            style={styles.input} />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="保存"
            style={styles.button}
            color="orange"
            onPress={this.onSubmit} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  buttonContainer: {
    padding: 15,
  }
})

const mapStateToProps = state => {
  return {
    config: state.config
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateConfig: data=>dispatch(updateConfig(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceConfigScreen)
