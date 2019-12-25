import React, {Component} from 'react'
import { Platform, View, Text, TouchableOpacity, BackHandler, WebView} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
const WEBVIEW_REF = 'WEBVIEW_REF'

export default class WebScreen extends Component {
  _didFocusSubscription
  _willBlurSubscription

  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', '币加'),
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  })

  constructor(props) {
    super(props)
    this.state = {
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

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f6f7fb'}}>
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
