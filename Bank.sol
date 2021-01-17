pragma solidity ^0.5.3;

contract Bank{
  uint public time = 0;
  uint public totalAmount;
  uint public counterDeposit = 0;
  uint public counterWithdraw = 0;

  address public owner;
  uint public threshold = 20;
  uint public upper_threshold = 50;

  mapping (address => uint) private balance;
  mapping (uint => History) public depositList;
  mapping (uint => History) public withdrawList;

  struct History {
    uint transaction_id;
    address payable account;
    uint amount;
    uint time;
  }

  event Deposited(
    uint transactionID,
    address account,
    uint totalBalance,
    uint amount,
    uint time
  );

  event Withdrawed(
    uint transactionID,
    address account,
    uint totalBalance,
    uint amount,
    uint time
  );

  constructor() public payable{
    totalAmount = 0;
    owner = msg.sender;
  }

  function deposit(uint _deposit) public payable {
    // Get balance for user account
    uint accBalance = getBalance();
    // Require amount
    require (_deposit > 0);
    // Increase counter
    counterDeposit ++;
    // Save deposit by address
    balance[msg.sender] += _deposit;
    // Save time stamp
    time = block.timestamp;
    // Save the transaction record in list
    depositList[counterDeposit] = History(counterDeposit, msg.sender, _deposit, time);
    // Update total Ether in smart contract
    totalAmount += _deposit;
    // Trigger an event
    emit Deposited(counterDeposit, msg.sender, accBalance, _deposit, time);

  }

  function withdraw(uint _withdraw) public {
    // Get balance for user account
    uint accBalance = getBalance();
    // Require amount && amount <= amountDeposited
    require (_withdraw > 0 && _withdraw <= accBalance);
    // Increase counter
    counterWithdraw ++;
    // Substract withdraw amount from balance[]
    balance[msg.sender] -= _withdraw;
    // Save time stamp
    time = block.timestamp;
    // Save the transaction record in list
    withdrawList[counterWithdraw] = History(counterWithdraw, msg.sender, _withdraw, time);
    // Update total amount
    totalAmount -= _withdraw;
    // Send ether to account
    msg.sender.transfer(_withdraw);
    // Trigger an event
    emit Withdrawed(counterWithdraw, msg.sender, accBalance, _withdraw, time);

  }

  function getBalance() public view returns (uint){
    return balance[msg.sender];
  }

}
