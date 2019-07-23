pragma solidity ^0.5.0;

import './Ownable.sol';

contract Certifyi is Ownable {
  mapping (bytes32 => address) public records;
  mapping (bytes32 => uint256) public timestamps;
  
  

  event LogCertified(bytes32 indexed record, address indexed certifier, uint256 timestamp);

  function certify(bytes32 _record) public {
    bytes32 hash = keccak256(abi.encodePacked(_record));
    require(hash != keccak256(""));
    require(records[hash] == address(0));
    require(timestamps[hash] == 0);
    records[hash] = msg.sender;
    timestamps[hash] = block.timestamp;

    emit LogCertified(hash, msg.sender, block.timestamp);
  }

  function exists(bytes32 _record) view public returns (bool) {
    bytes32 hash = keccak256(abi.encodePacked(_record));
    return records[hash] != address(0);
  }

  function getCertifier(bytes32 _record) view public returns (address) {
    return records[keccak256(abi.encodePacked(_record))];
  }

  function getTimestamp(bytes32 _record) view public returns (uint256) {
    return timestamps[keccak256(abi.encodePacked(_record))];
  }

  function didCertify(bytes32 _record) view public returns (bool) {
    return records[keccak256(abi.encodePacked(_record))] == msg.sender;
  }

  function isCertifier(bytes32 _record, address _notarizer) view public returns (bool) {
    return records[keccak256(abi.encodePacked(_record))] == _notarizer;
  }

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

  function ecverify(bytes32 _hash, bytes memory _sig, address _signer) pure public returns (bool) {
    return _signer == ecrecovery(_hash, _sig);
  }
}