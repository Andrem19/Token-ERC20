// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Token {

  string public name = "My Name";
  string public symbol = "DTOK";
  uint256 public decimals = 18;
  uint256 public totalSupply;

  //Track balances
  mapping(address => uint256) public balanceOf;

  event Transfer(address indexed from, address indexed to, uint256 _value);

  constructor() public {
  	totalSupply = 1000000 * (10**decimals);
    balanceOf[msg.sender] = totalSupply;
  }
  //Send tokens
  function transfer(address _to, uint256 _value) public returns(bool success) {
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);
    return true;
  }
}


