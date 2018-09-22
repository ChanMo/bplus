export function formatTime(timestamp) {
  let date = new Date(parseInt(timestamp)*1000)
  return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

export function formatBalance(price, places=2) {
  return parseFloat(Math.round(price*100)/100).toFixed(places)
}

export function getBalance(account) {

}
