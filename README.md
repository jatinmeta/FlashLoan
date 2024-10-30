# FlashLoan
Flash loans are a unique feature of decentralized finance (DeFi) protocols that allow users to borrow a large amount of crypto assets for a single transaction without requiring any collateral. The catch? The loan must be repaid in full, including interest, before the transaction is confirmed on the blockchain.


## **Prerequisites**

### **MetaMask setup**

- Install [MetaMask](https://metamask.io/)

### **Network Configuration**

1. Open MetaMask and navigate to the networks section.
2. Click on **Add Network** and enter the following details:
    - **Network Name:** Hardhat (Forked BSC)
    - **New RPC URL:** [http://127.0.0.1:8545]
    - **Chain ID:** 31337
    - **Currency Symbol:** BNB


### **Creating Infura API Key**

1. Go to [Infura website](https://app.infura.io/) and click the "Create New API Key" button shown in your dashboard
3. Under "Network," select "Web3 API."
4. Under "Endpoints," locate the "BNB Smart Chain Mainnet" option and enable it by clicking the toggle switch next to it.
5. Securely copy this API key. You'll need it to connect to the BSC Mainnet through Infura.



## How to run the Flash Loan**

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


