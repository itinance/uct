import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { UCToken__factory, UCToken, TollBridge__factory, TollBridge } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TollBridgeInterface } from "../typechain/TollBridge";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("TollBridge", () => {
  let token: UCToken,
    axel: SignerWithAddress,
    ben: SignerWithAddress,
    chantal: SignerWithAddress
    ;

  let tollBridgeFactory: TollBridge__factory,
    tollBridge: TollBridge;


  const increaseTime = async (delta: number) => {
    await ethers.provider.send("evm_increaseTime", [delta]);
    await ethers.provider.send("evm_mine", []);
  }

  const setTime = async (timestamp: number) => {
    await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
    await ethers.provider.send("evm_mine", []);
  }


  beforeEach(async () => {
    await ethers.provider.send("hardhat_reset", []);

    [axel, ben, chantal] = await ethers.getSigners();

    const tokenFactory = (await ethers.getContractFactory("UCToken", chantal)) as UCToken__factory;

    token = await tokenFactory.deploy();
    await token.deployed();
  });



  describe("we vest tokens", async () => {

    const
      startVesting: number  = _time("April 14 2022 0:01")
      ;

    let revoker: SignerWithAddress;

    beforeEach(async () => {

      revoker = chantal

      await setTime(startVesting);

      tollBridgeFactory = (await ethers.getContractFactory("TollBridge", chantal)) as TollBridge__factory;

      console.log("Start Vesting: " + startVesting)

      tollBridge = await tollBridgeFactory.deploy(token.address, startVesting);
      await tollBridge.deployed();

      console.log('TB Start:  ' + await tollBridge.start())

      // put in total 10k tokens for vesting
      await token.mint(tollBridge.address, 10000);
    })

    it("vesting was setup correctly", async () => {
      expect(await tollBridge.start()).to.eq(startVesting)
      expect(await token.balanceOf(tollBridge.address)).to.eq(10000);

      expect(await tollBridge.getTotalBalance()).to.eq(10000);
    })

    it("vesting for Axel", async () => {
      await tollBridge.addBeneficiary(axel.address, 5000)
      expect(await tollBridge.getBeneficiaryAmount(axel.address)).to.eq(5000);
      expect(await tollBridge.getBeneficiaryAmount(ben.address)).to.eq(0);
      expect(await tollBridge.getBeneficiaryAmount(chantal.address)).to.eq(0);
    })

  })

})

function _now(): number {
  return Math.round((new Date()).getTime() / 1000);
}

function _time(s: string) : number {
  return Math.round((new Date(s)).getTime() / 1000)
}
