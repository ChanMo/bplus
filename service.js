import {AsyncStorage} from 'react-native'
import BackgroundTask from 'react-native-background-task'
import tokens from './tokens'

BackgroundTask.define(async()=>{
  const tokens = Object.keys(tokens).toString()
  let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${tokens}&convert=CNY`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-CMC_PRO_API_KEY': 'afa301a7-3f5d-4694-b87c-eb48e6e07cc8'
    }
  })
  //const responseJson = response.json()
  //console.log(responseJson.data)
  //await AsyncStorage.setItem('market', JSON.stringify(responseJson.data))
  const result = response.text()
  if(!('_40' in JSON.parse(result))) {
    await AsyncStorage.setItem('market', response.text())
  }
  BackgroundTask.finish()
})

export default BackgroundTask
