import React, {Component} from 'react'
import {AsyncStorage, View, Text, Button} from 'react-native'

export default class ExportScreen extends Component {
  static navigationOptions = {
    title: '导出钱包'
  }

  constructor(props) {
    super(props)
    this.state = {
      mnemonic: null
    }
  }

  _getMnemonic = async() => {
    const mnemonic = await AsyncStorage.getItem('mnemonic')
    this.setState({mnemonic: mnemonic})
  }

  render() {
    return (
      <View>
        <Text>重要提示:拥有钱包备份就能完全控制钱包资产</Text>
        <Button title='导出' onPress={this._getMnemonic} />
        {this.state.mnemonic && <Text>{this.state.mnemonic}</Text>}
      </View>
    )
  }
}
