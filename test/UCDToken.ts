import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { UCToken__factory, UCToken } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Token", () => {
  let token: UCToken,
    axel: SignerWithAddress,
    ben: SignerWithAddress,
    chantal: SignerWithAddress
    ;


  beforeEach(async () => {
    const signers = await ethers.getSigners();

    axel = signers[0];
    ben = signers[1];
    chantal = signers[2];

    const tokenFactory = (await ethers.getContractFactory("UCToken", chantal)) as UCToken__factory;

    token = await tokenFactory.deploy();
    await token.deployed();

    const initialTotalSupply = await token.totalSupply();

    // 3
    expect(initialTotalSupply).to.eq(0);
    expect(token.address).to.properAddress;
  });

  // 4
  describe("we can mint tokens", async () => {

    it("should mint tokens to Axel successfully", async () => {
      const totalSupplyBefore = await token.totalSupply();

      const balanceBefore = await token.balanceOf(axel.address);
      expect(balanceBefore).to.eq(0);

      await token.mint(axel.address, 1001);

      const balance = await token.balanceOf(axel.address)
      expect(balance).to.eq(1001);

      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.eq(totalSupplyBefore.add(1001));
    });

    describe("we can mint even more tokens", async () => {

      beforeEach(async () => {
        // initial supply to Axel
        await token.mint(axel.address, 1001);
      })

      it("should mint tokens to Ben successfully as well", async () => {
        const totalSupplyBefore = await token.totalSupply();
        expect(totalSupplyBefore).to.eq(1001);

        const balanceBefore = await token.balanceOf(ben.address);
        expect(balanceBefore).to.eq(0);

        await token.mint(ben.address, 505);

        const balance = await token.balanceOf(ben.address)
        expect(balance).to.eq(505);

        const totalSupply = await token.totalSupply();
        expect(totalSupply).to.eq(1506);

        const balanceAxel = await token.balanceOf(axel.address)
        expect(balanceAxel).to.eq(1001);
      });

    });
  });

});


