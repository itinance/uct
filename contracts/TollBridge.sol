// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./UCToken.sol";

/**
 * @title TollBridge
 *
 */
contract TollBridge {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 private constant MONTH  = 2635200;
    uint256 private constant DAY  = 86400;
    uint256 private constant HOLD = 1095890411000000;



    event TokensReleased(uint256 amount);

    // mapping for all beneficiaries holding their final amount of vested token
    mapping(address => uint256) private _beneficiaries;

    // starting time, all timnestamps are expressed in UNIX time, the same units as block.timestamp.
    uint256 private _start;

    // the actual token
    UCToken private _token;

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param token address of the token which should be vested
     * @param start_ the time (as Unix time) at which point vesting starts
     */
    constructor (address token, uint256 start_) {
        require(token != address(0), "TollBridge: token is the zero address");
        require(start_ > 0, "TollBridge: start time is zero");

        _token = UCToken(token);
        _start = start_;
    }


    /**
     * @return the start time of the token vesting.
     */
    function start() public view returns (uint256) {
        return _start;
    }

    function addBeneficiary(address beneficiary, uint256 amount) public {
        _beneficiaries[beneficiary] += amount;
    }

    function getBeneficiaryAmount(address beneficiary) public view returns (uint256) {
        return _beneficiaries[beneficiary];
    }

    /**
     * @dev balance in total whether its released or not
     */
    function getTotalBalance() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }

    /**
     * @notice Transfers vested tokens to beneficiary.
     */
    function release(uint256 amount) public {
        address beneficiary = msg.sender;
        uint256 amountTotal = _beneficiaries[msg.sender];
        uint256 currentBalance = _token.balanceOf(beneficiary);

        //needs an endDate
        require((amountTotal-currentBalance) + amount <= getActivatedAmount(start(),0,amountTotal), "There are not enough available tokens at this point");

        //require(amount > 0, "There are no tokens left for beneficiary in this contract");

        // playing with test values

        //need an endDate
        _token.transfer(beneficiary, getReleasableAmount(start(), 0, amount));
        _token.burn(getBurnAmount(start(), 0, amount));
    }

    function getActivatedPercent(uint256 startDate, uint256 endDate) public pure returns (uint256) {
       require(endDate >= startDate,"Enddate must be greater than startdate");
        uint256 months = floor((endDate - startDate)/MONTH);
        uint256 quarters = floor(months / 3);

        return min((quarters * 5*10**16 ),1*10**18);
    }

    function getBurnPercent (uint256 startDate, uint256 endDate) public pure returns (uint256) {
        require(endDate >= startDate,"Enddate must be greater than startdate");
        uint256 days_ = floor((endDate - startDate) / DAY);
        if(days_ >= 730){return 0;}
        uint256 burnAmount = 8*10**17-(days_ * HOLD);

        return max(burnAmount, 0);
    }

    function getActivatedAmount(uint256 startDate, uint256 endDate, uint256 amount) public pure returns (uint256) {
        uint256 activatedAmount = (amount * getActivatedPercent(startDate,endDate)) / (10**18);

        return activatedAmount;
    }

    function getBurnAmount (uint256 startDate, uint256 endDate, uint256 amount) public pure returns (uint256) {
        uint256 burnAmount = (amount * getBurnPercent(startDate, endDate)) / (10**18);

        return burnAmount;
    }

    function getReleasableAmount (uint256 startDate, uint256 endDate, uint256 amount)public pure returns (uint256) {
        uint256 releasableAmount = (amount * (10**18 - getBurnPercent(startDate, endDate))) / (10**18);
        return releasableAmount;
    }

    function max (uint256 x, uint256 y)private pure returns(uint256){
        return x >= y ? x : y;
    }
    function min (uint256 x, uint256 y)private pure returns(uint256){
        return x >= y ? y : x;
    }

    function floor(int x) private pure returns (int) {
        return int(uint(x));
    }
    function floor(uint x) private pure returns (uint) {
        return uint(x);
    }


}
