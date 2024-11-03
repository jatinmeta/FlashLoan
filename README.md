# FlashLoan
Flash loans are a unique feature of decentralized finance (DeFi) protocols that allow users to borrow a large amount of crypto assets for a single transaction without requiring any collateral. The catch? The loan must be repaid in full, including interest, before the transaction is confirmed on the blockchain.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
  - [MetaMask setup](#metamask-setup)
  - [Network Configuration](#network-configuration)
  - [Creating Infura API Key](#creating-infura-api-key)
- [How to run Flash Loan](#how-to-run-the-flash-loan)
    - [Setting Up Your Hardhat Project](#setting-up-your-hardhat-project)
    - [Run Frontend](#run-frontend)
- [Smart Contract Artitecture](#smart-contract-artitecture)
- [Contributing](#contributing)
- [Contact](#contact)

## Prerequisites
- Decentralized Finance(Defi)
- Solidity 
- Hardhat

## Development Setup
### MetaMask setup

- Install [MetaMask](https://metamask.io/)

### Network Configuration

1. Open MetaMask and navigate to the networks section.
2. Click on **Add Network** and enter the following details:
    - **Network Name:** Hardhat (Forked BSC)
    - **New RPC URL:** [http://127.0.0.1:8545]
    - **Chain ID:** 31337
    - **Currency Symbol:** BNB


### Creating Infura API Key

1. Go to [Infura website](https://app.infura.io/) and click the "Create New API Key" button shown in your dashboard
3. Under "Network," select "Web3 API."
4. Under "Endpoints," locate the "BNB Smart Chain Mainnet" option and enable it by clicking the toggle switch next to it.
5. Securely copy this API key. You'll need it to connect to the BSC Mainnet through Infura.



## How to run the Flash Loan

##### Setting Up Your Hardhat Project
1. Clone the repository:
    ```bash
    https://github.com/jatinmeta/FlashLoan.git
    ```
2. Install dependencies:
    ```bash
    cd Flash_Loan
    npm install --force
    ```

3. Fork BSC Mainet:
    ```bash
    npx hardhat node --fork https://bsc-mainnet.infura.io/v3/INFURA_API_kEY
    ```

3. Deploy Smart Contract on Running Hardhat node:
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

##### Run Frontend

1. Install dependencies:
    ```bash
    cd Frontend
    npm install 
    ```
2. Run the development server:
    ```bash
    npm run dev
    ```
Open the browser and go to `http://localhost:5173/`.

## Smart Contract Artitecture

![image](https://github.com/user-attachments/assets/475e1deb-821c-4064-aa32-c972e1d3033a)



## Contributing

We love contributions! Here's how you can help make the Flash Loan even better:

1. Fork the project (`git repo fork https://github.com/jatinmeta/FlashLoan.git`)
2. Create your feature branch (`git checkout -b New_Feature`)
3. Commit your changes (`git commit -m 'Added New Feature'`)
4. Push to the branch (`git push origin New_Feature`)
5. Open a Pull Request

## Contact

Please open an issue in the GitHub repository for any queries or support.
