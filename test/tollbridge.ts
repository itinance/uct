import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { UCToken__factory, UCToken, TollBridge__factory, TollBridge } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {BigNumber} from "ethers";


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

  const readData = async () : Promise<string[]> => {
    const fsp = require('fs').promises;
    let rawData = await fsp.readFile('test/Burndata.csv', 'utf8');
    let fullArray = rawData.split('\n');
    let burnAmounts = fullArray[1].split(';');
    burnAmounts.shift();
    return burnAmounts;
  }



    const
      genesisTime: number = _time("April 15 2022 0:00"),
      startVesting: number  = _time("April 15 2022 0:00")
      ;



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
    await ethers.provider.send("evm_setNextBlockTimestamp", [genesisTime]);
    await ethers.provider.send("evm_mine", []);

    [axel, ben, chantal] = await ethers.getSigners();

    const tokenFactory = (await ethers.getContractFactory("UCToken", chantal)) as UCToken__factory;

    token = await tokenFactory.deploy();
    await token.deployed();
  });



  describe("we vest tokens", async () => {

    let revoker: SignerWithAddress;

    beforeEach(async () => {
      revoker = chantal

      tollBridgeFactory = (await ethers.getContractFactory("TollBridge", chantal)) as TollBridge__factory;

      console.log("Start Vesting: " + startVesting)

      tollBridge = await tollBridgeFactory.deploy(token.address, startVesting);
      await tollBridge.deployed();

      console.log('TB Start:  ' + await tollBridge.start())

      // put in total 10k tokens for vesting
      await token.mint(tollBridge.address, BigNumber.from('10000000000000000000000'));
    })

    it("vesting was setup correctly", async () => {
      expect(await tollBridge.start()).to.eq(startVesting)
      expect(await token.balanceOf(tollBridge.address)).to.eq(BigNumber.from('10000000000000000000000'));

      expect(await tollBridge.getTotalBalance()).to.eq(BigNumber.from('10000000000000000000000'));
    })

    it('testing burn values', async () => {
      const start = await tollBridge.start();
      const values = await readData();

      for(let i = 1; i<730; i++){
        expect(await tollBridge.getBurnPercent(start, start.add(1+86400*i))).to.eq(values[i-1]);
      }
      expect(await tollBridge.getBurnPercent(start, start.add(1+86400*730))).to.eq(0);
    })

    it('testing release values', async () => {
      const start = await tollBridge.start();
      await tollBridge.addBeneficiary(axel.address, BigNumber.from('10000000000000000000000'))
      const tokens = BigNumber.from('10000000000000000000000');
      let balance = BigNumber.from(0);

      const tollBridgeWithAxelAsSender = await tollBridge.connect(axel);

      //checking values on start date
      expect(await tollBridge.getBeneficiaryAmount(axel.address)).to.eq('10000000000000000000000');
      expect(await token.balanceOf(axel.address)).to.eq(0);
      await expect(tollBridgeWithAxelAsSender.release(1)).to.be.revertedWith('There are not enough available tokens at this point')

      await increaseTime(86400 * 30.5 * 3 + 1);

      for(let i = 1; i<=20; i++){

        //Making sure activated amount is correct
        expect(await tollBridge.getActivatedAmount(start, start.add(86400 * 30.5 * 3 * i +1), tokens)).to.eq(BigNumber.from('500000000000000000000').mul(i));

        let released = await tollBridge.getReleasableAmount(start, start.add(86400 * 30.5 * 3 * i +1), BigNumber.from('100000000000000000000'));

        //incrementally releasing available amount and checking balance after
        for(let j = 1; j<6; j++){
          //releasing 100 tokens
          await tollBridgeWithAxelAsSender.release(BigNumber.from('100000000000000000000'));

          //balance should increase by released amount
          balance = balance.add(released);

          //check if balance is correct
          expect(await token.balanceOf(axel.address)).to.eq(balance);
        }

        //making sure no further tokens have been released
        await expect(tollBridgeWithAxelAsSender.release(1)).to.be.revertedWith('There are not enough available tokens at this point');

        //skipping to the next quarter
        await increaseTime(86400 * 30.5 * 3);
      }
    })

    it("vesting initializing", async () => {
      const start = await tollBridge.start();
      const tokens = BigNumber.from('20000000000000000000');
      expect(await tollBridge.getActivatedPercent( start, start.add(1))).to.eq(0);
      expect(await tollBridge.getBurnPercent( start, start.add(1))).to.eq('800000000000000000');

      expect(await tollBridge.getBurnAmount(start, start.add(1), tokens)).to.eq('16000000000000000000');
      expect(await tollBridge.getReleasableAmount(start, start.add(1), tokens)).to.eq('4000000000000000000');
      expect(await tollBridge.getActivatedAmount(start, start.add(1), tokens)).to.eq(0);

      expect(await tollBridge.getActivatedPercent( start, start.add(86400*30.5*3-1))).to.eq('0');
      expect(await tollBridge.getBurnPercent( start, start.add(86400*30.5*3))).to.eq('700273972599000000');
      expect(await tollBridge.getBurnPercent( start, start.add(86400 * (30.5 *3 + 1)))).to.eq('699178082188000000');
      expect(await tollBridge.getActivatedPercent( start, start.add(86400*30.5*3))).to.eq('50000000000000000');

      expect(await tollBridge.getBurnAmount(start, start.add(86400*30.5*3), tokens)).to.eq('14005479451980000000');
      expect(await tollBridge.getReleasableAmount(start, start.add(86400*30.5*3), tokens)).to.eq('5994520548020000000');
      expect(await tollBridge.getActivatedAmount(start, start.add(86400*30.5*3), tokens)).to.eq('1000000000000000000');

      expect(await tollBridge.getBurnPercent( start, start.add(86400*30.5*6))).to.eq('599452054787000000');
      expect(await tollBridge.getActivatedPercent( start, start.add(86400*30.5*6))).to.eq('100000000000000000');

      expect(await tollBridge.getBurnPercent( start, start.add(86400*30.5*12))).to.eq('398904109574000000');
      expect(await tollBridge.getActivatedPercent( start, start.add(86400*30.5*12))).to.eq('200000000000000000');

      await readData();
    })

    it("vesting initializing", async () => {
      await tollBridge.addBeneficiary(axel.address, 5000)
      expect(await tollBridge.getBeneficiaryAmount(axel.address)).to.eq(5000);
      expect(await tollBridge.getBeneficiaryAmount(ben.address)).to.eq(0);
      expect(await tollBridge.getBeneficiaryAmount(chantal.address)).to.eq(0);

      const start = await tollBridge.start();

      expect(await token.balanceOf(axel.address)).to.eq(0)

      const tollBridgeWithAxelAsSender = await tollBridge.connect(axel)

      const totalBefore = await token.balanceOf(tollBridge.address)
      console.log(1, totalBefore.toString())
      console.log((await tollBridge.getTimeStamp()).toString())

      await expect(tollBridgeWithAxelAsSender.release(100)).to.be.revertedWith('There are not enough available tokens at this point')

      const totalAfter = await token.balanceOf(tollBridge.address)
      console.log(2, totalAfter.toString())

      expect(await token.balanceOf(axel.address)).to.eq(0)

      await increaseTime(86400 * 30.5 *3 + 1);

      await tollBridgeWithAxelAsSender.release(100)
      expect(await token.balanceOf(axel.address)).to.eq(29)

      await expect(tollBridgeWithAxelAsSender.release(200)).to.be.revertedWith('There are not enough available tokens at this point')

      await tollBridgeWithAxelAsSender.release(100)
      expect(await token.balanceOf(axel.address)).to.eq(58)

    })

  })

})

function _now(): number {
  return Math.round((new Date()).getTime() / 1000);
}

function _time(s: string) : number {
  return Math.round((new Date(s)).getTime() / 1000)
}
