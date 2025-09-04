import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./CrowdfundingApp.css";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xfaf0e15B7fef28D0d977Dd4f2636949e51Bd9912";

// Replace with your contract ABI (from compilation)
const CONTRACT_ABI = [ [
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_goalInWei",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationInSeconds",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ContributionReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundsWithdrawn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goalReached",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRaised",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
  // Paste the ABI JSON here
];

function CrowdfundingApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [goal, setGoal] = useState("0");
  const [deadline, setDeadline] = useState(0);
  const [totalRaised, setTotalRaised] = useState("0");
  const [contribution, setContribution] = useState("");
  const [status, setStatus] = useState("");
  const [goalReached, setGoalReached] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (window.ethereum) {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
    } else {
      setStatus("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    if (provider) {
      provider.send("eth_requestAccounts", []).then(accounts => {
        setAccount(accounts[0]);
        const tempSigner = provider.getSigner();
        setSigner(tempSigner);
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, tempSigner);
        setContract(tempContract);
      });
    }
  }, [provider]);

  useEffect(() => {
    if (contract) {
      fetchContractData();
      const interval = setInterval(() => {
        fetchContractData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  async function fetchContractData() {
    try {
      const goalWei = await contract.goal();
      setGoal(ethers.utils.formatEther(goalWei));
      const deadlineTimestamp = await contract.deadline();
      setDeadline(deadlineTimestamp.toNumber());
      const raisedWei = await contract.totalRaised();
      setTotalRaised(ethers.utils.formatEther(raisedWei));
      const reached = await contract.goalReached();
      setGoalReached(reached);

      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(Math.max(deadlineTimestamp.toNumber() - now, 0));
    } catch (err) {
      setStatus("Error fetching contract data");
    }
  }

//   async function handleContribute() {
//     if (!contribution || isNaN(contribution) || Number(contribution) <= 0) {
//       setStatus("Enter a valid contribution amount");
//       return;
//     }
//     try {
//       setStatus("Sending transaction...");
//       const tx = await contract.contribute({ value: ethers.utils.parseEther(contribution) });
//       await tx.wait();
//       setStatus("Contribution successful!");
//       setContribution("");
//       fetchContractData();
//     } catch (err) {
//       setStatus("Transaction failed or rejected");
//     }
//   }

async function handleContribute() {
  if (!contribution || isNaN(contribution) || Number(contribution) <= 0) {
    setStatus("Enter a valid contribution amount");
    return;
  }
  try {
    setStatus("Sending transaction...");
    const tx = await contract.contribute({
      value: ethers.utils.parseEther(contribution) // contribution is a string like "0.1"
    });
    setStatus("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      setStatus("Contribution successful!");
      fetchContractData();
    } else {
      setStatus("Transaction failed.");
    }
  } catch (err) {
    setStatus("Transaction failed or rejected");
  }
}

  function formatTime(seconds) {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor((seconds % (3600*24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  return (
    <div className="container">
      <h1 className="title">Crowdfunding DApp</h1>
      <p><strong>Connected account:</strong> {account || "Not connected"}</p>
      <p><strong>Goal:</strong> {goal} ETH</p>
      <p><strong>Total Raised:</strong> {totalRaised} ETH</p>
      <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
      <p><strong>Goal Reached:</strong> {goalReached ? "Yes 🎉" : "No"}</p>

      <div className="contribute-section">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount in ETH"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          className="input"
        />
        <button onClick={handleContribute} className="btn">
          Contribute
        </button>
      </div>

      <p className="status">{status}</p>

      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${Math.min((parseFloat(totalRaised) / parseFloat(goal)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default CrowdfundingApp;