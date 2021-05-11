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
      saleStarts: number = _time("January 1 2022 0:01"),
      vestingFinished: number = _time("April 3 2024 13:01"),

      period: number  = 86400 * 30.5 * 3, // 1 quarter
      startVesting: number  = saleStarts + period, // starts 1 quarter later
      releasesCount: number  = 24 / 3, // 24 months as quarter = 24/3 = 8
      duration: number  = period, // 8 quarters
      revocable = true
      ;

    let revoker: SignerWithAddress;

    beforeEach(async () => {

      revoker = chantal

      await setTime(saleStarts);

      tollBridgeFactory = (await ethers.getContractFactory("TollBridge", chantal)) as TollBridge__factory;

      console.log("Start Vesting: " + startVesting)
      console.log("Duration:      " + duration)
      console.log("Finished:      " + vestingFinished)

      tollBridge = await tollBridgeFactory.deploy(token.address, axel.address, startVesting, duration, releasesCount, revocable, revoker.address);
      await token.deployed();

      console.log('TB Start:  ' + await tollBridge.start())
      console.log('TB Finish: ' + await tollBridge.finish())

    })

    it("vesting was setup correctly", async () => {
      expect(await tollBridge.start()).to.eq(startVesting)
      expect(await tollBridge.finish()).to.eq(vestingFinished)

      expect(await tollBridge.finish()).to.eq(startVesting + period * releasesCount)

    })

    it("should mint tokens to Axel successfully", async () => {

      await token.mint(tollBridge.address, 1000);
      expect(await token.balanceOf(tollBridge.address)).to.eq(1000);

      expect(await tollBridge.getTotalBalance()).to.eq(1000);
      expect(await tollBridge.getAvailableTokens()).to.eq(0);

      await increaseTime(period)
      expect(await tollBridge.getAvailableTokens()).to.eq(0);

      await increaseTime(period+1)
      expect(await tollBridge.getAvailableTokens()).to.eq( 1000 / 8 );

      await increaseTime(period)
      expect(await tollBridge.getAvailableTokens()).to.eq( 1000 / 8 * 2);

      await increaseTime(period)
      expect(await tollBridge.getAvailableTokens()).to.eq( 1000 / 8 * 3 );

      /*
            await increaseTime(startVesting + duration)
            expect(await tollBridge.getAvailableTokens()).to.eq(1000);
      */
    })

  })

})

function _now(): number {
  return Math.round((new Date()).getTime() / 1000);
}

function _time(s: string) : number {
  return Math.round((new Date(s)).getTime() / 1000)
}
