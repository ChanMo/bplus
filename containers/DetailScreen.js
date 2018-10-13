import React, {Component} from 'react'
import {StyleSheet, Dimensions, ImageBackground, Image, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import tokens from '../tokens'

const {width} = Dimensions.get('window')

export default class WalletScreen extends Component {
  static navigationOptions = {
    title: '交易详情'
  }

  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount() {
    
  }

  _renderBody = () => {
    return (
      <View style={styles.box}>
          <View style={styles.boxHeader}>
            <View style={{alignSelf:'center'}}>
                <Image style={styles.headerImg} source={require('../images/detail-tip.png')}></Image>
            </View>
            <Text style={styles.headerTitle}>收款成功</Text>
            <Text style={styles.headerTime}>2018年07月19日  10:02</Text>
          </View>
          {this._renderMsg()}
      </View>
    )
  }

  _renderMsg = () =>{
      return(
        <View style={{padding:20}}>
            <View style={styles.listBox}>
                <Text style={{width:80,fontSize:14,color:'#1c2562'}}>金额:</Text>
                <Text style={styles.listRight}>100,000xdc</Text>
            </View>
            <View style={{borderBottomWidth:.4,borderColor:'#808080'}}></View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>旷工费用:</Text>
                <View style={styles.listRight}>
                    <Text style={{fontSize:11,textAlign:'right',color:'#27337d',fontWeight:'100'}}>UxDbE8801539M25aCq</Text>
                    <Text style={{fontSize:11,textAlign:'right',color:'#27337d',fontWeight:'100'}}>=Gas(53,030)*GasPrice(11.16 gwei)</Text>
                </View>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>收款地址:</Text>
                <Text style={styles.listRight}>UxDbE8801539M25aCq4C020B1Cpp210A</Text>
                <View style={styles.listBtnBox}>
                    <Image style={styles.listBtn} source={require('../images/detail-copy.png')}></Image>
                </View>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>付款地址:</Text>
                <Text style={styles.listRight}>UxDbE8801539M25aCq4C020B1Cpp210A</Text>
                <View style={styles.listBtnBox}>
                    <Image style={styles.listBtn} source={require('../images/detail-copy.png')}></Image>
                </View>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>备注:</Text>
                <Text style={styles.listRight}>我是备注</Text>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>交易号:</Text>
                <Text style={styles.listRight}>awodwadidiawdjiawdj</Text>
                <View style={styles.listBtnBox}>
                    <Image style={styles.listBtn} source={require('../images/detail-copy.png')}></Image>
                </View>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>区块:</Text>
                <Text style={styles.listRight}>6986143</Text>
            </View>
            <View style={styles.listBox}>
                <Text style={styles.listLeft}>订单二维码:</Text>
                <View style={styles.listRight}>
                    <Image style={{height:60,width:60,alignSelf:'flex-end'}} source={require('../images/group.png')}></Image>
                </View>
            </View>
        </View>
      )
  }

  render() {
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
