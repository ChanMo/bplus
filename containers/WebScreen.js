import React, {Component} from 'react'
import {StatusBar, Platform, View, Text, TouchableOpacity, BackHandler, StyleSheet, WebView} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
const WEBVIEW_REF = 'WEBVIEW_REF'

export default class WebScreen extends Component {
  _didFocusSubscription
  _willBlurSubscription

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.navigation.getParam('title', 'BPlus'),
      link: props.navigation.getParam('link', 'http://www.findchen.com'),
      canGoBack: false
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack()
      return true
    } else {
      this.props.navigation.goBack()
      return true
    }
  };

  onNavigationStateChange = (nav) => {
    this.setState({canGoBack:nav.canGoBack})
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _renderHeader() {
    const { navigate, goBack } = this.props.navigation
    return (
      <View style={styles.header}>
        <View style={{flex:1,alignItems:'center',flexDirection:'row'}}>
          <TouchableOpacity onPress={this.onBackButtonPressAndroid}>
            <Icon name='arrow-left' size={24} color='rgb(68,68,68)' />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>goBack()} style={{marginLeft:15}}>
            <Icon
              name='x'
              size={24}
              color='rgb(68,68,68)'/>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{this.state.title}</Text>
        <View style={{flex:1}}></View>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar translucent={false} barStyle='dark-content' />
        {this._renderHeader()}
        <WebView
          ref={WEBVIEW_REF}
          startInLoadingState={true}
          source={{uri:this.state.link}}
          onNavigationStateChange={this.onNavigationStateChange}
          allowsInlineMediaPlayback={true}
          style={{flex:1}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height:Platform.OS === 'ios' ? 64 : 54,
    alignItems:'center',
    flexDirection:'row',
    paddingHorizontal:15,
    backgroundColor:'white',
    paddingTop:Platform.OS === 'ios' ? 16 : 0,
    elevation: 3,
  },
  title: {
    flex:6,
    color:'black',
    fontSize:20,
    fontWeight: 'bold',
    textAlign:'center'
  }
})
