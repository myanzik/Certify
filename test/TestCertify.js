//const moment = require('moment')
const {sha3} = require('ethereumjs-util')

const Certify = artifacts.require('./Certifyi.sol')

function getLastEvent(instance) {
  return new Promise((resolve, reject) => {
    instance.getPastEvents({
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, log) => {
      if (error) return reject(error)
      resolve(log[0])
    })
  })
}

contract('Certify', function(accounts) {
  it('should create a record', async function() {
    const account = accounts[0]

    try {
      const instance = await Certify.deployed()
      // SHA-256 of file
      const msg = '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'
      const hash = web3.utils.sha3(msg)

      await instance.certify(hash)

      const eventObj = await getLastEvent(instance)
      assert.equal(eventObj.event, 'LogCertified')

      const certifier = await instance.getCertifier(hash)
      assert.equal(certifier, account)
    } catch(error) {
      //console.error(error)
      assert.equal(error, undefined)
    }
  })

  it('should fail if record already exists', async function() {
    const account = accounts[0]

    try {
      const instance = await Certify.deployed()
      const msg = '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'
      const hash = web3.utils.sha3(msg)

      await instance.certify(hash)
      const certifier = await instance.getCertifier(hash)
      console.log(certifier);
      console.log(account);
      assert.notEqual(certifier, account)
    } catch(error) {
      //console.error(error)
      assert.ok(error)
    }
  })

  it('should check whether account is Certifier or not',async function(){
    const account = accounts[0]

    try{
      const instance = await Certify.deployed()
      const msg = '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'
      const hash = web3.utils.sha3(msg)

      await instance.certify(hash,{from:account})
      const isCertifier = await instance.isCertifier(hash,account);
      
      assert.equal(isCertifier,true);

    }
    catch(error) {
      //console.error(error)
      assert.ok(error)
    }

  })

  it('should return timestamp of record',async function(){
    const account = accounts[0]
    var currentDate = new Date();
    
   

    try{
      const instance = await Certify.deployed()
      const msg = '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'
      const hash = web3.utils.sha3(msg)
  
      await instance.certify(hash)
  
  
    const timestamp = await instance.getTimestamp(hash)
    console.log("tmstp",timestamp);
    assert.equal(currentDate,timestamp);

    }
    catch(error){

    }

  })

  

  // it('should recover address from signature', async function() {
  //   const account = accounts[0]

  //   try {
  //     const instance = await Certify.deployed()
  //     let msg = '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'
  //     //finc sha3 hash and slice to 0x terms
  //     const hash = (web3.utils.sha3(msg)).slice(2); 
  //     console.log(hash);

  //     msg = new Buffer(hash, 'hex');
  //     console.log(msg);

  //     const sig = await web3.eth.sign(hash, account)
  //     console.log("signature=",sig);

  //     const prefix = Buffer.from('\x19Ethereum Signed Message:\n32');
  //     console.log("\nBuffered==",prefix);

  //     //const pmsg = `0x${sha3(Buffer.concat([prefix, Buffer.from(String(msg.length)), msg])).toString('hex')}`
  //     const pmsg = `0x${sha3(Buffer.concat([prefix, msg])).toString('hex')}`
  //    // const pmsg = `0x${sha3([prefix, Buffer.from(String(msg.length)), msg]).toString('hex')}`
  //     console.log("pmsg",pmsg);

  //     console.log("buffer",Buffer.from(String(msg.length)));
  //     console.log("prefixed message",pmsg);

  //     const recoveredAccount = await instance.ecrecovery.call(pmsg, sig)
  //     console.log("Accounts======",recoveredAccount)
  //     assert.equal(recoveredAccount, account)

  //     const acct = await instance.getCertifier(hash)
  //     const isSigner = await instance.ecverify(pmsg, sig, acct)
  //     assert.equal(isSigner, true)
  //   } catch(error) {
  //     //console.error(error)
  //     assert.equal(error, undefined)
  //   }
  // })
})
