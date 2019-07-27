pragma solidity ^0.5.0;

import './Ownable.sol';

/// @title A Certified Proof Of Existence of Any Document
/// @author Manjik Shrestha
/// @notice You can use this contract to store hash of your document on blockchain
/// @dev takes bytes32 hash and maps it to the callers address and timestamp

contract Certifyi is Ownable {

  mapping (bytes32 => address) public records;
  mapping (bytes32 => uint256) public timestamps;
  
  

  event LogCertified(bytes32 indexed record, address indexed certifier, uint256 timestamp);

/// @notice Stores the given hash in Blockchain
/// @dev stores address of function caller and blocks timestamp is stored via mapping and emits LogCertified event 
/// @param _record Hash of the given document
  function certify(bytes32 _record) public {
    bytes32 hash = keccak256(abi.encodePacked(_record));
    require(hash != keccak256(""),"input is invalid");
    require(records[hash] == address(0),"this record have already been certified");
    require(timestamps[hash] == 0,"unexpected error");
    records[hash] = msg.sender;
    timestamps[hash] = block.timestamp;

    emit LogCertified(hash, msg.sender, block.timestamp);
  }

/// @notice checks if hash already exists on smart contract
/// @dev hash the given record and checks if it maps to any address
/// @param _record Hash of the given document
/// @return bool value explaining whether hash already exists or not
  function exists(bytes32 _record) view public returns (bool) {
    bytes32 hash = keccak256(abi.encodePacked(_record));
    return records[hash] != address(0);
  }

/// @notice get the certifier of the Document
/// @dev checks the address mapped with given parameter
/// @param _record Hash of the given document
/// @return address of the certifier
  function getCertifier(bytes32 _record) view public returns (address) {
    return records[keccak256(abi.encodePacked(_record))];
  }

/// @notice get the timestamp when document is certified
/// @dev checks the timestamp mapped with given parameter
/// @param _record Hash of the given document
/// @return timestamp of the document certification
  function getTimestamp(bytes32 _record) view public returns (uint256) {
    return timestamps[keccak256(abi.encodePacked(_record))];
  }


/// @notice check whether the function caller certify the given record
/// @dev checks whether the hash mapped with address equals msg.sender or not
/// @param _record Hash of the given document
/// @return  bool value explaining whether the given record certified by function caller or not
  function didCertify(bytes32 _record) view public returns (bool) {
    return records[keccak256(abi.encodePacked(_record))] == msg.sender;
  }

/// @notice check whether the given address is certifier of given record
/// @dev checks whether the hash mapped with given record equals given address
/// @param _record Hash of the given document
/// @param _certifier Address of document certifier
/// @return  bool value explaining whether the given record certified by given address or not
  function isCertifier(bytes32 _record, address _certifier) view public returns (bool) {
    return records[keccak256(abi.encodePacked(_record))] == _certifier;
  }

/// @dev Recover signer address from a message by using his signature
/// @param _hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
/// @param _sig bytes signature, the signature is generated using web3.eth.sign()
/// @return address that generated _sig by siging the hash
  function ecrecovery(bytes32 _hash, bytes memory _sig)  pure public returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    if (_sig.length != 65) {
      return address(0);
    }

    assembly {
      r := mload(add(_sig, 32))
      s := mload(add(_sig, 64))
      v := and(mload(add(_sig, 65)), 255)
    }

    if (v < 27) {
      v += 27;
    }

    if (v != 27 && v != 28) {
      return address(0);
    }

    return ecrecover(_hash, v, r, s);
  }

/// @dev checks whether the signer claimed is actually the signer or not
/// @param _hash bytes32 message, the hash is the signed message.
/// @param _sig bytes signature, the signature is generated using web3.eth.sign()
/// @param _signer address of claimed signer of given hash
/// @return bool value explaining whether the claimed signer is true or not

  function ecverify(bytes32 _hash, bytes memory _sig, address _signer) pure public returns (bool) {
    return _signer == ecrecovery(_hash, _sig);
  }
}