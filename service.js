import { AsyncStorage } from 'react-native'
import PushNotification from 'react-native-push-notification';
import Web3 from 'web3';
import tokens from './tokens'
export default async() => {
  console.log('runService')
  const account = await AsyncStorage.getItem('account')
  if(!account) {
    return
  }
  console.log('account is: ', account)
  const lastLog = await AsyncStorage.getItem('lastLog')
  console.log('last log is: ', lastLog)

  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=latest&offset=5&sort=desc&apikey=G1T2IX1V1J157RINVS4H1R7QJ3811Z4D6W`
  return fetch(url)
    .then(response => response.json())
    .then(async(json )=> {
      const result = json.result

      if(result.length <= 0) {
        console.log('no logs')
        return
      }

      let index = result.findIndex(item => item.hash == lastLog)
      console.log('current index is: ', index)
      if(index < 0) {
        AsyncStorage.setItem('lastLog', result[0].hash)
        return
      }
      while(index) {
        index--
        //转出或转入金额
        let value = 0
        let token = ''
        if(result[index].value==0){
          //token转账
          let inde = Object.values(tokens).findIndex(item=>item.address.toLowerCase()==result[index].to.toLowerCase())
          token = Object.keys(tokens)[inde]
          let input = result[index].input
          value = web3.utils.fromWei(web3.eth.abi.decodeParameter('int',input.substr(74)))
        }else{
          //ETH转账
          token = 'ETH'
          value = web3.utils.fromWei(result[index].value)
        }

        let remind = account.toLowerCase()==result[index].from.toLowerCase()?'转账':'收款'
        let title = account.toLowerCase()==result[index].from.toLowerCase()?'转账成功':'收款成功'
        console.log('value',result[index].value,value,token)
        PushNotification.localNotification({
          title: title,
          message: remind+' '+value+' '+token+ '。'
        })
        console.log('set last log: ', result[index].hash)
        AsyncStorage.setItem('lastLog', result[index].hash)
      }
    })
  //const response = await fetch(url)
  //const responseJson = response.json()
  //const result = responseJson.result
  //} catch(err) {
  //  console.log(err)
  //  return
  //}
  return
}
