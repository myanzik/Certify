# Avoiding Common Attacks
    There are many known attacks which we should be aware of while writing smart contract.
    In this project I have considered following attacks:

### Timestamp Dependence
    when timestamp is used in contract, miner can actually post a timestamp within 15 seconds of the block being validated.According to the [Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf), it specify that each timestamp should be bigger than the timestamp of its parent. Popular Ethereum protocol implementations Geth and Parity both reject blocks with timestamp more than 15 seconds in future.
    So, In cnsideration with the purpose of this project, varying timestamp for 15 seconds is not a big deal. hence, this attack can be considered obsolete.

### DoS with (Unexpected) revert
    In order to avoid Unexpexted revert, contract is written just to store the hash of document mapped to address and timestamp. also every uint size is explicitly defined according to the requirement.