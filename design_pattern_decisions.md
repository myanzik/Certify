# Introduction

This project is much more focused on the implementation of the Smart Contract to develop Fully Functioning Decentralized Application. Smart contract is written on Solidity, which is a Turing complete Programming language for writing smart contract. A contract in solidity can be considered as a class in JAVA. In addition, Solidity has OOP features like inheritance , polymorphism and interfaces, etc.Due to such Properties we can also apply existing design patterns , like Creational, Structural, Behavioral Design pattern, to the Solidity Smart contract.

## Design Pattern

#### Hash Secret Design Pattern:
    Hash Secret is one of the type of Intra-behavioral Design Pattern. With this pattern we can help a user to achieve authorization of particular activity to unknown authorities. After the authority is decided then it willhave ability to finish further task.
    This design pattern do not contribute to the contract architecture but helps to manage the flow of a contract.
    In this project, Only the hash of the document is stored on the contract and we can only check its existence after somebody certifies it by creatin a transaction. Similary, we can generate a signature by signing that hash and only retrieve signer's address by providing hash and signature.

### Circuit Breaker Design Pattern:
    This design Pattern can Pause the contract when things are going wrong. Such feature will help to Manage the amount of money at risk and have an effective upgrade path for bugfixes and improvements. This design pattern will prevent both unintentional and intentional mistakes commited by users by reverting the transaction.
    In this project. users are restricted to upload the same file twice by checking the previously uploaded files. Similarly, transaction get reverted if it is being intiated by invalid address on invalid Environment.