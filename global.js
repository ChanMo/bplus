global.Buffer = require('buffer').Buffer;
global.process = require('process');

if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return new Buffer(str, "binary").toString("base64");
  }
}

if(typeof atob === 'undefined') {
  global.atob = function(b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  }
}

const Web3 = require('web3')
global.web3 = new Web3('http://47.94.206.167:8545');
