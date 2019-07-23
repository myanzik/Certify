const arrayBufferToBuffer = require('arraybuffer-to-buffer');
const {sha3} = require('ethereumjs-util');


function fileToBuffer (file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader()
      const readFile = function(event) {
        const buffer = reader.result
        resolve(buffer)
      }
  
      reader.addEventListener('load', readFile)
      reader.readAsArrayBuffer(file)
    })
  }
  
  async function bufferToSha3 (buffer) {
    return `0x${sha3(buffer).toString('hex')}`
  }
  
  async function fileToSha3 (file) {
    const buffer = await fileToBuffer(file)
    const hash = bufferToSha3(arrayBufferToBuffer(buffer))
  
    return hash
  }

  module.exports = {
      fileToSha3:fileToSha3
  }