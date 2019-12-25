import React, {Component} from 'react'
import {View, AsyncStorage, ActivityIndicator} from 'react-native'
import { connect } from 'react-redux'

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props)
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const account = await AsyncStorage.getItem('account')
    if(account && this.props.account.address) {
      this.props.navigation.navigate('App')
    } else {
      this.props.navigation.navigate('Auth')
    }

  }

  render() {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: state.account
  }
}

export default connect(mapStateToProps)(AuthLoadingScreen)
