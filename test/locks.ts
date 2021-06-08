import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { UCToken__factory, UCToken } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;



describe("TokenLocks", () => {
  let token: UCToken,
    axel: SignerWithAddress,
    ben: SignerWithAddress,
    chantal: SignerWithAddress,

    deployer: SignerWithAddress,

    minter1: SignerWithAddress,
    minter2: SignerWithAddress
    ;

  beforeEach(async () => {

    const signers = await ethers.getSigners();

    let i = 0;

    axel = signers[i++];
    ben = signers[i++];
    chantal = signers[i++];

    deployer = signers[i++];

    minter1 = signers[i++];
    minter2 = signers[i++];

    const tokenFactory = (await ethers.getContractFactory(
      "UCToken",
      deployer
    )) as UCToken__factory;

    token = await tokenFactory.connect(deployer).deploy();
    await token.deployed();
  });

  it("a non-admin is not allowed to create locks", async () => {
    await expect(token.connect(chantal).addLock(axel.address, now() + 1))
      .to.be.revertedWith('revert Restricted to admins');
  })

  it("can't create a lock for the past", async () => {
    await expect(token.connect(deployer).addLock(axel.address, now() - 1))
      .to.be.revertedWith('revert Can\'t create a lock for the past');
  })

  describe("setup minting role", async () => {
    let minterRole: string;
    const
      lockDelta = 86400 * 2,
      releaseTime = now() + lockDelta;

    beforeEach(async () => {
      // add Minter1 as minter
      minterRole = await token.MINTER_ROLE();
      await token.connect(deployer).grantRole(minterRole, minter1.address);
    });

    it("Create a lock for Axel", async () => {
      await token.connect(deployer).addLock(axel.address, releaseTime)

      const balance = await token.balanceOf(axel.address)
      expect(balance).to.eq(0);

      const releaseTimeLock = await token.getLock(axel.address)
      expect(releaseTimeLock).to.eq(releaseTime);

      let isLocked = await token.isLocked(axel.address)
      expect(isLocked).to.be.true;

      isLocked = await token.isLocked(ben.address)
      expect(isLocked).to.be.false;
    });

    it("Can't create locks twice", async () => {
      await token.connect(deployer).addLock(ben.address, releaseTime)
      await expect(token.connect(deployer).addLock(ben.address, releaseTime))
        .to.be.revertedWith('A Lock was already created for this beneficiary');
    });

    it("Can't transfer token within lock period", async () => {
      await token.connect(deployer).addLock(ben.address, releaseTime);
      await token.connect(minter1).mint(ben.address, 1000);

      const balanceBen = await token.balanceOf(ben.address);
      expect(balanceBen).to.eq(1000);

      await expect(token.connect(ben).transfer(chantal.address, 1000)).to.be.revertedWith('Tokens for this account are still locked');

      const balanceChantal = await token.balanceOf(chantal.address);
      expect(balanceChantal).to.eq(0);
    });

    it("Can successfully transfer token after lock period", async () => {
      await token.connect(deployer).addLock(ben.address, releaseTime);
      await token.connect(minter1).mint(ben.address, 1000);

      let balanceBen = await token.balanceOf(ben.address);
      expect(balanceBen).to.eq(1000);

      await ethers.provider.send("evm_increaseTime", [86400*2]);
      await ethers.provider.send("evm_mine", []);

      token.connect(ben).transfer(chantal.address, 600);
      await ethers.provider.send("evm_mine", []);

      const balanceChantal = await token.balanceOf(chantal.address);
      expect(balanceChantal).to.eq(600);

      balanceBen = await token.balanceOf(ben.address);
      expect(balanceBen).to.eq(400);
    });

  });

});


function now() : number {
  return Math.round((new Date()).getTime() / 1000);
}
