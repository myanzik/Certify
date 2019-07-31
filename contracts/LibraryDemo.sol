pragma solidity ^0.4.23;
import "./strings.sol";

contract Polling{
using strings for *;

  struct Event{
        uint id;
        string name;
        string description;
        mapping(uint => Options) options;
        uint optionsCount;
        mapping(address => bool) hasVoted;
        }

  bool public hasEnded;
  bool public hasStarted;

  mapping(uint => Event) public events;
  uint public eventCount;
  address public owner;

  mapping(address => bool) public canVote;

  struct Options{
    string name;
    uint vote;
    uint eventId;
  }

  constructor() public {
    owner=msg.sender;
  }

  function addEvent(string _name,string _description, string _options) public{
      require(msg.sender == owner);
      require(!hasStarted);
      require(!hasEnded);

    eventCount++;
    events[eventCount].id=eventCount;
    events[eventCount].name=_name;
    events[eventCount].description=_description;
    strings.slice memory s = _options.toSlice();
    strings.slice memory delim = "-".toSlice();
    string[] memory parts = new string[](s.count(delim)+1);

    for(uint i = 0; i < parts.length; i++) {
      parts[i] = s.split(delim).toString();
      addOptions(eventCount,parts[i]);
    }
  }

    function addOptions(uint eventId,string optionName) public{
        uint i=events[eventId].optionsCount;
        events[eventId].options[i].name=optionName;
        events[eventId].options[i].eventId=eventId;
        events[eventId].optionsCount++;
    }

  function addVoters(address voter) public{
      require(msg.sender==owner);
      require(!hasStarted);
      require(!hasEnded);
      canVote[voter]=true;
  }

  function getOptions(uint id) public view returns(string categories){
    categories=string(abi.encodePacked(events[id].options[0].name));

    for(uint i=1;i<events[id].optionsCount;i++){
      categories=string(abi.encodePacked(categories,",",events[id].options[i].name));
      }
    }

    function vote(uint _eventId,uint _optionId) public{
        require(hasStarted);
        require(!hasEnded);
      require(!events[_eventId].hasVoted[msg.sender]);
      require(canVote[msg.sender]);
      events[_eventId].options[_optionId].vote++;
      events[_eventId].hasVoted[msg.sender]=true;
    }

    function seeVotes(uint eventId) public view returns (uint[]){
        require(msg.sender==owner);
        require(hasStarted);
        require(hasEnded);
        uint eventOptionCount= events[eventId].optionsCount;
        uint[] memory num= new uint[](eventOptionCount);
        for(uint i=0;i<eventOptionCount;i++){
            num[i] =events[eventId].options[i].vote;
        }
        return num;
      }

      function startPoll() public{
          require(msg.sender==owner);
          hasStarted = true;
      }

      function endPoll() public{
          require(msg.sender==owner);
          require(hasStarted);
          hasEnded = true;
      }

      function kill() public{
       require (msg.sender == owner);
       selfdestruct(owner);
        }

}