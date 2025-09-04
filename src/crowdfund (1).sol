// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint public goal;
    uint public deadline;
    uint public totalRaised;
    mapping(address => uint) public contributions;
    bool public goalReached;
    bool public fundsWithdrawn;

    event ContributionReceived(address contributor, uint amount);
    event GoalReached(uint totalAmount);
    event FundsWithdrawn(address owner, uint amount);

    constructor(uint _goalInWei, uint _durationInSeconds) {
        owner = msg.sender;
        goal = _goalInWei;
        deadline = block.timestamp + _durationInSeconds;
        goalReached = false;
        fundsWithdrawn = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not reached");
        _;
    }

    function contribute() external payable beforeDeadline {
        require(msg.value > 0, "Must send some ether");
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (totalRaised >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
    }

    function withdrawFunds() external onlyOwner afterDeadline {
        require(goalReached, "Goal not reached");
        require(!fundsWithdrawn, "Funds already withdrawn");

        fundsWithdrawn = true;
        payable(owner).transfer(address(this).balance);

        emit FundsWithdrawn(owner, address(this).balance);
    }

    function refund() external afterDeadline {
        require(!goalReached, "Goal was reached, no refunds");
        uint contributed = contributions[msg.sender];
        require(contributed > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributed);
    }
}