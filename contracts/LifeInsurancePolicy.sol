// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseInsurancePolicy.sol";

/**
 * @title LifeInsurancePolicy
 * @dev LifeInsurancePolicy is a contract for managing a life insurance policy
 */

contract LifeInsurancePolicy is BaseInsurancePolicy {
    error WithdrawingError();
    error PolicyNomineeNotFound();
    SharedData.LifePolicyParams private s_lifePolicyParams;

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

        uint256 withdrawableAmount = s_policy.totalCoverageByPolicy;
        for (uint256 i = 0; i < s_lifePolicyParams.nominees.length; i++) {
            s_lifePolicyParams.nominees[i].nomineeDetails.policyHolderWalletAddress.transfer(
                (withdrawableAmount * s_lifePolicyParams.nominees[i].nomineeShare) / 100
            );
        }
        setTermination(true);
    }
}
