// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


/**
 * @title TollBridge
 *
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme.
 */
contract TollBridge {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event TokensReleased(uint256 amount);
    event TokensVestingRevoked(address receiver, uint256 amount);

    // beneficiary of tokens after they are released
    address private _beneficiary;

    // Durations and timestamps are expressed in UNIX time, the same units as block.timestamp.
    uint256 private _start;
    uint256 private _finish;
    uint256 private _duration;
    uint256 private _releasesCount;
    uint256 private _released;

    address private _revoker;
    bool private _revocable;
    bool private _revoked;

    IERC20 private _token;

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param token address of the token which should be vested
     * @param beneficiary_ address of the beneficiary to whom vested tokens are transferred
     * @param start_ the time (as Unix time) at which point vesting starts
     * @param duration_ duration in seconds of each release
     * @param revocable_ whether the vesting is revocable or not
     * @param revoker_ address who can revoke funds
     */
    constructor (address token, address beneficiary_, uint256 start_, uint256 duration_, uint256 releasesCount, bool revocable_, address revoker_) {
        require(beneficiary_ != address(0), "TollBridge: beneficiary is the zero address");
        require(token != address(0), "TollBridge: token is the zero address");
        require(revoker_ != address(0), "TollBridge: revoker is the zero address");
        require(duration_ > 0, "TollBridge: duration is 0");
        require(releasesCount > 0, "TollBridge: releases count is 0");
        require(start_.add(duration_) > block.timestamp, "TollBridge: final time is before current time");

        _token = IERC20(token);
        _beneficiary = beneficiary_;
        _revocable = revocable_;
        _duration = duration_;
        _releasesCount = releasesCount;
        _start = start_;
        _finish = _start.add(_releasesCount.mul(_duration));

        _revoker = revoker_;
    }


    // -----------------------------------------------------------------------
  	// GETTERS
	  // -----------------------------------------------------------------------


    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the start time of the token vesting.
     */
    function start() public view returns (uint256) {
        return _start;
    }

    /**
     * @return the finish time of the token vesting.
     */
    function finish() public view returns (uint256) {
        return _finish;
    }

    /**
     * @return the duration of the token vesting.
     */
    function duration() public view returns (uint256) {
        return _duration;
    }

    /**
     * @return true if the vesting is revocable.
     */
    function revocable() public view returns (bool) {
        return _revocable;
    }

    /**
     * @return the amount of the token released.
     */
    function released() public view returns (uint256) {
        return _released;
    }

    /**
     * @return true if the token is revoked.
     */
    function revoked() public view returns (bool) {
        return _revoked;
    }

    /**
     * @return address, who allowed to revoke.
     */
    function revoker() public view returns (address) {
        return _revoker;
    }

    /**
     * @dev count of tokens that could get released NOW
     */
    function getAvailableTokens() public view returns (uint256) {
        return _releasableAmount();
    }

    /**
     * @dev balance in total whether its released or not
     */
    function getTotalBalance() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }


	// -----------------------------------------------------------------------
	// SETTERS
	// -----------------------------------------------------------------------


    /**
     * @notice Transfers vested tokens to beneficiary.
     */
    function release() public {
        uint256 unreleased = _releasableAmount();
        require(unreleased > 0, "release: No tokens are due!");

        _released = _released.add(unreleased);
        _token.safeTransfer(_beneficiary, unreleased);

        emit TokensReleased(unreleased);
    }

    /**
     * @notice Allows the owner to revoke the vesting. Tokens already vested
     * remain in the contract, the rest are returned to the owner.
     * @param receiver Address who should receive tokens
     */
    function revoke(address receiver) public {
        require(msg.sender == _revoker, "revoke: unauthorized sender!");
        require(_revocable, "revoke: cannot revoke!");
        require(!_revoked, "revoke: token already revoked!");

        uint256 balance = _token.balanceOf(address(this));
        uint256 unreleased = _releasableAmount();
        uint256 refund = balance.sub(unreleased);

        _revoked = true;
        _token.safeTransfer(receiver, refund);

        emit TokensVestingRevoked(receiver, refund);
    }


	// -----------------------------------------------------------------------
	// INTERNAL
	// -----------------------------------------------------------------------


    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     */
    function _releasableAmount() private view returns (uint256) {
        return _vestedAmount().sub(_released);
    }

    /**
     * @dev Calculates the amount that has already vested.
     */
    function _vestedAmount() private view returns (uint256) {
        uint256 currentBalance = _token.balanceOf(address(this));
        uint256 totalBalance = currentBalance.add(_released);

        if (block.timestamp < _start) {
            return 0;
        } else if (block.timestamp >= _finish || _revoked) {

            console.log("TOTALXXX");

            return totalBalance;
        } else {
            uint256 timeLeftAfterStart = block.timestamp.sub(_start);
            uint256 availableReleases = timeLeftAfterStart.div(_duration);
            uint256 tokensPerRelease = totalBalance.div(_releasesCount);

            return availableReleases.mul(tokensPerRelease);
        }
    }
}