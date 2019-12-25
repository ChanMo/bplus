import React, { Component } from 'react'
import { StyleSheet, TextInput, BackHandler, WebView, TouchableOpacity, DeviceEventEmitter, View, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux'

const WEBVIEW_REF = 'WEBVIEW_REF'

class FindScreen extends Component {
  _didFocusSubscription
  _willBlurSubscription

  constructor(props) {
    super(props)
    this.state = {
      homeUrl: 'https://www.dapp.com/',
      url: 'https://www.dapp.com/',
      inputUrl: null,
      canGoBack: false
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('scanner_url_success',
      (e)=>this.setState({url:e}))
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack()
      return true
    } else {
      this.props.navigation.goBack()
      return true
    }
  }

  onReload = () => {
    this.refs[WEBVIEW_REF].reload()
  }

  onGoHome = () => {
    if(this.state.url != this.state.homeUrl) {
      this.setState({url: this.state.homeUrl})
    }
  }

  onNavigationStateChange = (nav) => {
    this.setState({
      inputUrl: nav.url,
      canGoBack: nav.canGoBack
    })
  }

  onScanner = () =>{
    this.props.navigation.navigate('Scanner', {'type':'url'})
  }

  _renderHeader = () => (
    <View style={styles.header}>
      {this.state.canGoBack &&
      <TouchableOpacity
        style={{marginRight:10}}
        onPress={this.onBackButtonPressAndroid}>
        <Icon name='arrow-left' size={20} />
      </TouchableOpacity>}
      <TouchableOpacity
        style={{marginRight:10}}
        onPress={this.onReload}>
        <Icon name='rotate-cw' size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginRight:10}}
        onPress={this.onGoHome}>
        <Icon name='home' size={20} />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
      <TextInput
        style={{flex:1}}
        keyboardType="url"
        returnKeyType="go"
        onChangeText={(inputUrl)=>this.setState({inputUrl})}
        value={this.state.inputUrl}
        blurOnSubmit={true}
        onSubmitEditing={()=>this.setState({url: this.state.inputUrl})}
        placeholder="请输入网址" />
        <TouchableOpacity onPress={this.onScanner}>
          <Icon name='maximize' size={20} color='#808080' />
        </TouchableOpacity>
      </View>
    </View>
  )

  _renderMain = () => (
    <WebView
      useWebKit={true}
      source={{uri:this.state.url}}
      startInLoadingState={true}
      ref={WEBVIEW_REF}
      onNavigationStateChange={this.onNavigationStateChange}
    />
  )

  render() {
    return (
      <View style={{flex:1,
        ...IphoneX.ifIphoneX({
          marginTop: 44
        }, {
          marginTop: Platform.OS === 'ios' ? 20 : 0,
        })}}>
        {this._renderHeader()}
        {this._renderMain()}
      </View>
    )
  }
}
import IphoneX from './../reducers/isIphoneX'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor:'white',
    shadowOffset: {width:0,height:1},
    shadowColor: 'lightgrey',
    shadowOpacity: 0.9,
    elevation: 2
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 38,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

const mapStateToProps = state => {
  return {
    account: state.account.address
  }
}

export default connect(mapStateToProps)(FindScreen)
