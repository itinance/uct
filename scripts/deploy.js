//import { ethers } from "hardhat";
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {

  const tokenFactory = await ethers.getContractFactory("UCToken");
  let token = await tokenFactory.deploy();

  // The address the Contract WILL have once mined
  console.log("Token: " + token.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log("- Transaction: " + token.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined
  await token.deployed();

  console.log("Ready.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
