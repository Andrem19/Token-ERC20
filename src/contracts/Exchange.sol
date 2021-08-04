pragma solidity ^0.5.4;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

//Deposit & Withdraw Funds
//Manage Orders - Make or Cancel
//Handle Trades - Charge fees

import "./Token.sol";

contract Exchange {
    using SafeMath for uint;

    address public feeAccount;//the account that receives exchange fees
    uint256 public feePrecentage;//the fee percentage

    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint amount, uint balance);

    constructor (address _feeAccount, uint256 _feePrecentage) public {
        feeAccount = _feeAccount;
        feePrecentage = _feePrecentage;
    }

    //Which token? args
    //How much? args
    function depositToken(address _token, uint _amount) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));//Send tokens to this contract
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);//Manage deposit - update balanceOf
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);//Emit event
    }


}