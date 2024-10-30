const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Deploying the Flash Loan contract
  const FlashLoan = await hre.ethers.getContractFactory("Flash_Loan");
  const flashLoanInstance = await FlashLoan.deploy();
  await flashLoanInstance.deployed();

  console.log("Flash Loan Contract deployed to:", flashLoanInstance.address);

  // Save the ABI and address to the frontend
  saveFrontendFiles(flashLoanInstance);
}

function saveFrontendFiles(contract) {
  const contractsDir = __dirname + "/../../Frontend/src/ABI_Address";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save the contract address
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ FlashLoan: contract.address }, undefined, 2)
  );

  // Save the contract ABI
  const FlashLoanArtifact = hre.artifacts.readArtifactSync("Flash_Loan");
  fs.writeFileSync(
    contractsDir + "/FlashLoan.json",
    JSON.stringify(FlashLoanArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
