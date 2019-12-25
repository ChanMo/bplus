import React, {Component} from 'react'
import { View, Image, Text,FlatList,StyleSheet} from 'react-native'


const data = [
    {name:'微博', contact:'https://weibo.com/bijiabijia',path:'https://weibo.com/bijiabijia'},
    {name:'邮箱', contact:'snd1@sina.com'},
    {name:'微信', contact:'ale166188'},
  ]

export default class AboutScreen extends Component {
  static navigationOptions = {
    title: '联系我们',
    headerStyle:{
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
    }
  }
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    _keyExtractor = (item,i) => i.toString()

    _renderItem = ({item,index}) => (
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:2,paddingHorizontal:15,paddingVertical:10,backgroundColor:'#ffffff',width:'100%',display:'flex'}}>
            <View style={{flexDirection:'row',alignItems:'center',height:30}}>
                <Text style={{color:'rgb(68,68,68)',fontSize:14}}>{item.name}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',height:30}}>
                <Text style={{color:item.path?'blue':'rgb(68,68,68)',fontSize:14}}
                    onPress={()=>item.path?this.props.navigation.navigate('Web',{link:item.path}):null}>{item.contact}</Text>
            </View>
        </View>
    )

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f6f7fb'}}>
        <FlatList
          style={{flex:1,width:'100%',marginTop:10}}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    littitle:{
        fontSize:16,
        color:'#666666'
    }
})
