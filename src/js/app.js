const truffleContract = require('truffle-contract');
const moment = require('moment');
const detectNetwork = require('web3-detect-network');
const watchProvider = require('./provider.helper');
const generateHash = require('./hash.helper');
const wait = require('promise-wait');
const arrayBufferToBuffer = require('arraybuffer-to-buffer');
const {sha3} = require('ethereumjs-util');

const source = require('../../build/contracts/Certifyi.json');

let instance = null
let account = null
let network = 'localhost' //by default

let addresses = {
  localhost: '0xaACe50E4D1cacccD95B804B9bC2B2912b6798C52',
  rinkeby: '',
  kovan: '',
  ropsten: '0xaACe50E4D1cacccD95B804B9bC2B2912b6798C52',
  mainnet: ''
}

//wait for metamask
window.addEventListener('load', onLoad)

async function onLoad () {
  try {
    await init()
  } 
  catch (error) {
    alert(error.message)
    console.log(error);
  }
}


async function init () {
  contract = truffleContract(source);
  console.log("displaying contract",contract)


  // await wait(1000);

  // const {id:netId} = await detectNetwork(watchProvider.getProvider())
  // if (netId == 1) {
  //     network = 'mainnet'
  // } else if (netId == 42) {
  //     network = 'kovan'
  // } else if (netId == 3) {
  //     network = 'ropsten'
  // } else if (netId == 4) {
  //     network = 'rinkeby'
  // } else {
  //   network = 'localhost'
  // }

  // let allowedNetworks = Object.keys(addresses).filter(x => addresses[x])

  // if (allowedNetworks.indexOf(network) === -1) {
  //   alert('Unsupported network. Supported networks: ' + allowedNetworks.join(', '))
  // }

  provider = watchProvider.getProvider()
  contract.setProvider(provider)

  contractAddress = addresses[network]

  //document.querySelector('#networkType').innerHTML = 'localhost'
  // if (network !== 'localhost') {
  //   document.querySelector('#etherscanLink').style.display = 'inline-block'
  //   document.querySelector('#etherscanLink').href = `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io/address/${contractAddress}`
  // }

  instance = await contract.at(contractAddress)
  console.log(instance);
  account = await watchProvider.getAccount()

  if (!window.web3) {
    window.web3 = new window.Web3(provider)
  }
}

//Certify your Document

const stampFileInput = document.querySelector('#stampFile')
const stampOutHash = document.querySelector('#stampHash')
const stampForm = document.querySelector('#stampForm')

stampFileInput.addEventListener('change', handleStampFile, false)
stampForm.addEventListener('submit', handleStampForm, false)

//get a file name and generate hash
async function handleStampFile (event) {
  stampOutHash.value = ''
  const file = event.target.files[0]
  const hash = await generateHash.fileToSha3(file)

  stampOutHash.value = hash
}


async function handleStampForm (event) {
  event.preventDefault()
  const target = event.target

  if (!account) {
    alert('Metamask not Connected');
    return false
  }

  const hash = stampOutHash.value

  if (!hash) {
    alert('Please select the document')
    return false
  }

  target.classList.toggle('loading', true)
  await stampDoc(hash)
  target.classList.toggle('loading', false)
}

async function stampDoc (hash) {
  try {
    const exists = await instance.exists(hash, {from: account})

    if (exists) {
      alert('This document already exists on blockchain')
      return false
    }

    const value = await instance.certify(hash, {from: account})
    alert('Successfully certified document, Now your Certificates fingerprint remains on blockchain forever')
  } catch (error) {
    alert(error)
  }
}


//Check certified Document

const checkForm = document.querySelector('#checkForm')
const checkFile = document.querySelector('#checkFile')
const checkHash = document.querySelector('#checkHash')
const checkStamper = document.querySelector('#checkStamper')
const checkDatetime = document.querySelector('#checkDatetime')
checkFile.addEventListener('change', handleCheckFile, false)
checkForm.addEventListener('submit', handleCheckForm, false)

async function handleCheckFile (event) {
  checkHash.value = ''
  const file = event.target.files[0]

  const hash = await generateHash.fileToSha3(file)
  checkHash.value = hash
}

async function handleCheckForm (event) {
  event.preventDefault()

  checkStamper.value = ''
  checkDatetime.value = ''

  const hash = checkHash.value

  if (!hash) {
    alert('Please select the document')
    return false
  }

  const exists = await instance.exists(hash, {from: account})

  if (!exists) {
    alert('Document does not exist in smart contract')
    return false
  }

  try {
    const stamper = await instance.getCertifier(hash, {from: account})
    const timestamp = await instance.getTimestamp(hash, {from: account})
    const date = moment.unix(timestamp).format('YYYY-MM-DD hh:mmA')

    checkStamper.value = stamper
    checkDatetime.value = date
  } catch (error) {
    alert(error)
  }
}


//Sign the Certified Document

// const genSigForm = document.querySelector('#genSigForm')
// const genSigFile = document.querySelector('#genSigFile')
// const genSigHash = document.querySelector('#genSigHash')
// genSigForm.addEventListener('submit', handleGenSigForm, false)

// async function handleGenSigForm (event) {
//   event.preventDefault()

//   genSigHash.value = ''
//   const file = genSigFile.files[0]
//   const hash = await generateHash.fileToSha3(file)

//   const exists = await instance.exists(hash, {from: account})

//   if (!exists) {
//     alert('Please stamp document before generating signature')
//     return false
//   }

//   if (!account) {
//     alert('Please connect MetaMask account set to Rinkeby network')
//     return false
//   }

//   const stamper = await instance.getNotarizer(hash, {from: account})

//   if (stamper !== account) {
//     alert('You are not the stamper of this document')
//     return false
//   }

//   web3.eth.sign(account, hash, (error, sig) => {
//     genSigHash.value = sig
//   });
// }


// //Verify Signature

// const verifySigForm = document.querySelector('#verifySigForm')
// const verifySigFile = document.querySelector('#verifySigFile')
// const verifySigInput = document.querySelector('#verifySigInput')
// const verifySigOut = document.querySelector('#verifySigOut')
// verifySigForm.addEventListener('submit', handleVerifySigForm, false)

// async function handleVerifySigForm (event) {
//   event.preventDefault()

//   verifySigOut.innerHTML = ''
//   const file = verifySigFile.files[0]

//   const hash = await generateHash.fileToSha3(file)
//   const sig = verifySigInput.value

//   const exists = await instance.exists(hash, {from: account})

//   if (!exists) {
//     alert('There is no record for this document')
//     return false
//   }

//   if (!sig) {
//     alert('Please input signature string')
//     return false
//   }

//   const addr = await instance.getNotarizer(hash)
//   const isSigner = await instance.ecverify(hash, sig, addr, {from: account})

//   let output = `<span class="red">✘ ${addr} <strong>IS NOT</strong> signer of ${hash}</span>`

//   if (isSigner) {
//     output = `<span class="green">✔ ${addr} <strong>IS</strong> signer of ${hash}</span>`
//   }

//   verifySigOut.innerHTML = output
// }



