//import { ethers } from "hardhat";
import pkg from 'hardhat';
const { ethers, upgrades } = pkg;

let deployed = '0x5a284bb95f68010ce2bE0d63230A907700Ee70e7';

async function main() {

  const tollBridgeFactory = await ethers.getContractFactory("TollBridge");

  const startDate = Math.round((new Date(2021, 6, 14, 13, 0, 0)).getTime() / 1000);
  console.log("StartDate: ", startDate)


  const tollBridge = await upgrades.deployProxy(tollBridgeFactory, ["0x2743a80ED2577935E75Ba9F150130389f9D2b111", startDate], { initializer: 'initialize' });
  await tollBridge.deployed();

  console.log(tollBridge)
  console.log('TollBridge deployed to:', tollBridge.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log("- Transaction: " + tollBridge.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined

  console.log("Ready.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
