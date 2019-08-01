# Certify
Upload your documents on the blockchain to certify the proof of its existence.

## Description of this project
1. Upload any Document and create a hash of that document to be stored on smart contract.
2. This project never store uploaded document anywhere. it just extract hash of that document.
3. the hash of the document is presented as the proof of its existence.
4. Document is timestamped with current block timestamp.
5. You can also digitally sign the document through metamask and generate signature.
6. Signature proves that you have validated this document and signed it.
7. you can check the signer of the document by uploading document and respective signature.

## Demo

You can see Demo here : https://www.youtube.com/watch?v=n2jBZkqVDCU

## Test

Run testrpc at port 8545. then run:
```
truffle test
```

### Requirements
1. node --version == v8.10.0
2. npm --version == 3.5.2
3. lite-server (same as pet-shop truffle box)

## Development

1. Clone Repository:

    ```
    git clone https://github.com/myanzik/Certify.git
    cd Certify
    ```
2. install dependencies:

    ```
    npm install
    ```

3. start testrpc:

    ```
    testrpc
    ```
    If testrpc not installed then enter:
    ```
    npm install -g ethereumjs-testrpc
    ```
4. migrate to local testnet:
    ```
    truffle migrate
    ```
5. update the smart contract address in src/app.js

6. Build a project by running:
    ```
    npm run build:client
    ```

7. start frontend server:
    ```
    npm run dev
    ```
    Now yoou should see lite server running

## Deployment to ropsten

1. Update your mnemonic key in truffle-config.js
    Note: If you have real ether in your wallet never upload mnemonic key or private key.
            you can put it in .env and export it to truffle-config.js

2. Run truffle deploy --network ropsten
    ```
    truffle deploy --network ropsten
    ```

3. update the smart contract address in src/app.js

4. rebuild frontent scripts:
    ```
    npm run build:client
    ```

5. run npm run dev:
    ```
    npm run dev
    ```
    OR
    
    Deploy public/ frontend to your server and run.
