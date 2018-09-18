import React, {Component} from 'react'
import {StatusBar, StyleSheet, View, TextInput, Text, Button} from 'react-native'
import colors from '../colors'

export default class TransferScreen extends Component {
  static navigationOptions = {
    title: '转账'
  }

  render() {
    return (
      <View style={{flex:1,padding:30}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        <View style={styles.form}>
          <Text style={styles.label}>钱包地址</Text>
          <View style={styles.input}>
            <TextInput height={40} />
          </View>
          <Text style={styles.label}>转账数量</Text>
          <View style={styles.input}>
            <TextInput height={40}
              keyboardType='decimal-pad' />
          </View>
          <Text style={styles.label}>备注</Text>
          <View style={styles.input}>
            <TextInput height={40} />
          </View>
        </View>
        <Button title='下一步' color={colors.primary} onPress={()=>this.props.navigation.navigate('Password')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 50,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightgrey,
    borderRadius: 2,
    marginBottom: 15,
    paddingHorizontal:10,
  }
})
