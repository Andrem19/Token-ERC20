// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
  using SafeMath for uint;

  string public name = "My Name";
  string public symbol = "DTOK";
  uint256 public decimals = 18;
  uint256 public totalSupply;

  //Events
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  //Track balances
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  constructor() public {
  	totalSupply = 1000000 * (10**decimals);
    //msg.sender -> user deployed contract
    balanceOf[msg.sender] = totalSupply;
  }

  function _transfer(address _from, address _to, uint256 _value) internal {
    require(_to != address(0));
    balanceOf[_from] = balanceOf[_from].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);
    emit Transfer(_from, _to, _value);
  }

  //Send tokens
  function transfer(address _to, uint256 _value) public returns (bool success){
    require(balanceOf[msg.sender] >= _value);
    _transfer(msg.sender, _to, _value);
    return true;
  }

  //Approve tokens
  function approve(address spender, uint256 value) public returns(bool success) {
    require(spender != address(0));
    allowance[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  //Transfer from
  function transferFrom(address from, address to, uint256 value) public returns(bool success) {
    require(value <= balanceOf[from]);
    require(value <= allowance[from][msg.sender]);//less than approved amount
    allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);//resets the allowance
    _transfer(from, to, value);
    return true;
  }

}


