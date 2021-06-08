import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { UCToken__factory, UCToken } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;



describe("TokenMinting", () => {
  let token: UCToken,
    axel: SignerWithAddress,
    ben: SignerWithAddress,
    chantal: SignerWithAddress,

    deployer: SignerWithAddress,

    minter1: SignerWithAddress,
    minter2: SignerWithAddress
    ;

  beforeEach(async () => {

    [axel, ben, chantal, deployer, minter1, minter2] = await ethers.getSigners();

    const tokenFactory = (await ethers.getContractFactory(
      "UCToken",
      deployer
    )) as UCToken__factory;

    token = await tokenFactory.connect(deployer).deploy();
    await token.deployed();
  });

  it("minting for non-minter accounts should not be allowed", async () => {
    await expect(token.connect(chantal).mint(chantal.address, 1001))
      .to.be.revertedWith('revert UCToken: must have minter role to mint');
  })

  describe("minter-role can mint tokens", async () => {

    let minterRole: string;

    beforeEach(async () => {
      // add Minter1 as minter

      minterRole = await token.MINTER_ROLE();
      await token.connect(deployer).grantRole(minterRole, minter1.address);
    });

    it("should mint tokens to Axel successfully", async () => {
      const totalSupplyBefore = await token.totalSupply();

      const balanceBefore = await token.balanceOf(axel.address);
      expect(balanceBefore).to.eq(0);

      await token.connect(minter1).mint(axel.address, 1001);

      const balance = await token.balanceOf(axel.address)
      expect(balance).to.eq(1001);

      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.eq(totalSupplyBefore.add(1001));
    });

    it("minting for Minter2 account should not be allowed", async () => {
      await expect(token.connect(minter2).mint(axel.address, 1001)).to.be.revertedWith('revert UCToken: must have minter role to mint');
    })

    it("adding another minter should work and let they mint tokens finally", async () => {
      await expect(token.connect(minter2).mint(axel.address, 1001)).to.be.revertedWith('revert UCToken: must have minter role to mint');
    })

  });


});


