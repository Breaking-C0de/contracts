// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseInsurancePolicy.sol";

/**
 * @dev LifeInsurancePolicy
 * note This is an example policy which shows the usage of BaseInsurance Policy
 */

contract LifeInsurancePolicy is BaseInsurancePolicy {
    // Errors are defined here
    error WithdrawingError();
    error PolicyNomineeNotFound();

    // Custom struct defined for the lifeInsurance Policy
    SharedData.LifePolicyParams private s_lifePolicyParams;

    /**
    @dev Constructor
    @param policy policy object, base insurance policy param object
    @param lifePolicyParams life policy param object, this is the custom struct defined for the life insurance policy
    @param _link chainlink link token address
    @param priceFeed chainlink price feed address
     */
    constructor(
        SharedData.Policy memory policy,
        SharedData.LifePolicyParams memory lifePolicyParams,
        address _link,
        address priceFeed
    ) BaseInsurancePolicy(policy, _link, priceFeed) {
        // Loop over the nominees array and push it to storage
        for (uint256 i = 0; i < lifePolicyParams.nominees.length; i++) {
            s_lifePolicyParams.nominees.push(lifePolicyParams.nominees[i]);
        }
    }

    function getNominees() public view returns (SharedData.Nominee[] memory nominees) {
        return s_lifePolicyParams.nominees;
    }

    function getNominee(uint128 index) public view returns (SharedData.Nominee memory nominee) {
        return s_lifePolicyParams.nominees[index];
    }

    function getLifePolicyParams()
        public
        view
        returns (SharedData.LifePolicyParams memory lifePolicyParams)
    {
        return s_lifePolicyParams;
    }

    /**
    @dev withdraw function
    note here, the base withdraw function is overidden to implement custom logic in withdraw
    according to the policy
    */
    function withdraw() public payable override isNotTerminated {
        bool isNominee = false;
        for (uint256 i = 0; i < s_lifePolicyParams.nominees.length; i++) {
            if (
                msg.sender ==
                s_lifePolicyParams.nominees[i].nomineeDetails.policyHolderWalletAddress
            ) {
                isNominee = true;
                break;
            }
        }
        if (!isNominee) revert PolicyNomineeNotFound();
        if (!s_policy.isClaimable) revert PolicyNotClaimable();

        uint256 withdrawableAmount;
        if (address(this).balance < s_policy.totalCoverageByPolicy)
            withdrawableAmount = address(this).balance;
        else withdrawableAmount = s_policy.totalCoverageByPolicy;
        for (uint256 i = 0; i < s_lifePolicyParams.nominees.length; i++) {
            s_lifePolicyParams.nominees[i].nomineeDetails.policyHolderWalletAddress.transfer(
                (withdrawableAmount * s_lifePolicyParams.nominees[i].nomineeShare) / 100
            );
        }
        s_policy.isTerminated = true;
    }
}
