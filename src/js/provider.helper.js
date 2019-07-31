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



function getAccount () {
  if (window.web3) {
    return  window.web3.eth.accounts[0]
  }
}

module.exports ={
    getProvider: getProvider,
    getAccount: getAccount
}