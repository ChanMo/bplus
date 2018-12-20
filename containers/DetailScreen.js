import React, {Component} from 'react'
import {StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, ImageBackground, Image, View, Text, Clipboard,Alert} from 'react-native'
const {width} = Dimensions.get('window')
import {formatTime} from '../utils'
import QRCode from 'react-native-qrcode-svg'

export default class WalletScreen extends Component {
  static navigationOptions = {
    title: '交易详情'
  }

  constructor(props) {
    super(props)
    const navigation = props.navigation
    this.state = {
      hash: navigation.getParam('hash'),
      transaction: null,
      block: {},
      gasUsed:'',
    }
  }

  componentDidMount() {
    this._fetchData()
  }

  // 获取交易记录详情
  _fetchData = () => {
    web3.eth.getTransaction(this.state.hash).then((res) => {
      this.setState({transaction: res})
      web3.eth.getBlock(res.blockHash).then((ress) => this.setState({block: ress}))
    })
    web3.eth.getTransactionReceipt(this.state.hash).then((res) => {
        this.setState({gasUsed:res.gasUsed})
    })
  }

  _copyText = (value) => {
      Clipboard.setString(value);
      Alert.alert('已复制到剪切板')
  }

  _renderBody = () => {
    return (
      <View style={styles.box}>
          <View style={styles.boxHeader}>
            <View style={{alignSelf:'center'}}>
              <Image style={styles.headerImg}
                source={require('../images/detail-tip.png')}></Image>
            </View>
            <Text style={styles.headerTitle}>收款成功</Text>
            <Text style={styles.headerTime}>{formatTime(this.state.block.timestamp)}</Text>
          </View>
          {this._renderMsg()}
      </View>
    )
  }

  _renderMsg = () =>{
    const data = this.state.transaction
      return(
        <View style={{padding:20}}>
            <View style={styles.listBox}>
                <Text style={{width:80,fontSize:14,color:'#1c2562'}}>金额:</Text>
                <Text style={styles.listRight}>{web3.utils.fromWei(data.value, 'ether')}</Text>
            </View>
            <View style={{borderBottomWidth:.4,borderColor:'#808080'}}></View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>旷工费用:</Text>
                <View style={styles.listRight}>
                    <Text style={{fontSize:11,textAlign:'right',color:'#27337d',fontWeight:'100'}}>{web3.utils.fromWei((this.state.gasUsed*data.gasPrice).toString(),'ether')}</Text>
                    <Text style={{fontSize:11,textAlign:'right',color:'#27337d',fontWeight:'100'}}>=Gas({this.state.gasUsed})*GasPrice({web3.utils.fromWei(data.gasPrice,'gwei')} gwei)</Text>
                </View>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>收款地址:</Text>
                <Text style={styles.listRight}>{data.to}</Text>
                <TouchableOpacity
                  style={styles.listBtnBox}
                  onPress={()=>this._copyText(data.to)}>
                  <Image style={styles.listBtn} source={require('../images/detail-copy.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>付款地址:</Text>
                <Text style={styles.listRight}>{data.from}</Text>
                <TouchableOpacity style={styles.listBtnBox} onPress={()=>this._copyText(data.from)}>
                  <Image style={styles.listBtn} source={require('../images/detail-copy.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>备注:</Text>
                <Text style={styles.listRight}>{data.input}</Text>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>交易号:</Text>
                <Text style={styles.listRight}>{data.hash}</Text>
                <TouchableOpacity style={styles.listBtnBox} onPress={()=>this._copyText(data.hash)}>
                    <Image style={styles.listBtn} source={require('../images/detail-copy.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>区块:</Text>
                <Text style={styles.listRight}>{data.blockNumber}</Text>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>订单二维码:</Text>
                <View style={styles.listRight}>
                    <View style={{alignSelf:'flex-end',height:62,width:62,borderWidth:.3,borderColor:'#e1e1e1'}}>
                        <QRCode
                            size={60}
                            value={'222'}
                            bgColor='#ffffff'
                            fgColor='black'
                        />
                    </View>
                </View>
            </View>
        </View>
      )
  }

  render() {
    if(!this.state.transaction) {
      return <ActivityIndicator style={{marginTop:20}} />
    }
    return (
      <ImageBackground
        source={require('../images/wallet-bg.png')}
        imageStyle={{width:width,height:320,marginTop:-74}}
        style={{width:'100%',height:'100%',justifyContent:'center',backgroundColor:'rgb(245,243,251)'}}>
        {this._renderBody()}
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  box:{
      backgroundColor:'#ffffff',
      margin:10,
      borderRadius:5,
      height:'90%',
      overflow:'hidden'
  },
  boxHeader:{
      justifyContent:'center',
      backgroundColor:'#e1e4f2',
      padding:10
  },
  headerImg:{
      height:50,
      width:50,
      alignSelf:'center',
      marginBottom:10
  },
  headerTitle:{
      textAlign:'center',
      color:'#212b66',
      marginBottom:5
  },
  headerTime:{
        textAlign:'center',
        color:'#566774',
        fontWeight:'100'
  },
  listBox:{
      display:'flex',
      flexDirection:'row',
      padding:10,
      paddingLeft:0,
      paddingRight:0,
      position:'relative'
  },
  listLeft:{
    width:74,
    fontSize:13,
    color:'#1c2562'
  },
  listRight:{
      flex:1,
      textAlign:'right',
      fontSize:11,
      color:"#27337d",
      fontWeight:'100',
      marginRight:30
  },
  listBtnBox:{
    width:30,
    height:'100%',
    position:'absolute',
    right:0,
    top:10,
    justifyContent:'center'
   },
   listBtn:{
    width:16,
    height:16,
    alignSelf:'center'
   }
})
