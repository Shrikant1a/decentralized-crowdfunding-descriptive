# decentralized-crowdfunding-descriptive
ChainStarter is a decentralized crowdfunding DApp on Ethereum. Creators launch campaigns, supporters fund with crypto, and if goals aren’t met, contributors get refunds. Built with Solidity, Hardhat, and React, it ensures secure, transparent, and trustless fundraising.


# 🚀 Decentralized Crowdfunding DApp

A blockchain-based crowdfunding platform where:
- Users can **create campaigns**.
- Others can **contribute**.
- If the goal is met, the creator **claims funds**.
- Otherwise, contributors can **refund**.

## Tech Stack
- Solidity (Smart Contracts)
- Hardhat (Development & Testing)
- React + Ethers.js (Frontend)
- Ethereum Testnet (Sepolia/Goerli)

## Setup
```bash
git clone https://github.com/yourusername/crowdfunding-dapp.git
cd crowdfunding-dapp
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
