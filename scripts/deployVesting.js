//import { ethers } from "hardhat";
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {

  const tokenFactory = await ethers.getContractFactory("TollBridge");
  const startDate = Math.round((new Date(2021, 6, 13, 10, 0, 0)).getTime() / 1000);
  console.log("StartDate: ", startDate)
  let tollBridge = await tokenFactory.deploy("0x2743a80ED2577935E75Ba9F150130389f9D2b111", startDate);

  // The address the Contract WILL have once mined
  console.log("TollBridge: " + tollBridge.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log("- Transaction: " + tollBridge.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined
  await tollBridge.deployed();

  console.log("Ready.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
