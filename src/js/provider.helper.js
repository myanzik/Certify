function getProvider () {
  if (window.web3) {
    return window.web3.currentProvider
  }
else{
  const providerUrl = `https://localhost:8545`
  const provider = new window.Web3.providers.HttpProvider(providerUrl)

  return provider

}
}

// function getWebsocketProvider () {
//   // https://github.com/ethereum/web3.js/issues/1119
//   if (!window.Web3.providers.WebsocketProvider.prototype.sendAsync) {
//     window.Web3.providers.WebsocketProvider.prototype.sendAsync = window.Web3.providers.WebsocketProvider.prototype.send
//   }

//   return new window.Web3.providers.WebsocketProvider(`wss://${network}.infura.io/ws`)
// }

function getAccount () {
  if (window.web3) {
    return  window.web3.eth.accounts[0]
  }
}

module.exports ={
    getProvider: getProvider,
   // getWebsocketProvider: getWebsocketProvider,
    getAccount: getAccount
}