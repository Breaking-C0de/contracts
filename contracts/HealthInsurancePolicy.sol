// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseInsurancePolicy.sol";

/**
 * @title LifeInsurancePolicy
 * @dev LifeInsurancePolicy is a contract for managing a life insurance policy
 */

abstract contract HealthInsurancePolicy is BaseInsurancePolicy {
    error InvalidContractAddress();
    error AmountExceeded();
    error IncorrectAmount();
    error FundingError();
    SharedData.HealthPolicyParams private s_healthPolicyParams;

    constructor(
        SharedData.Policy memory policy,
        SharedData.HealthPolicyParams memory healthPolicyParams
    ) /*BaseInsurancePolicy(policy)*/ {
        s_healthPolicyParams = healthPolicyParams;
    }

    function getCopaymentPercentage() public view returns (uint256 copaymentPercentage) {
        return s_healthPolicyParams.copaymentPercentage;
    }

    function withdraw(uint256 amount) public payable {
        // Get BaseContract
        if (!s_policy.isClaimable) revert PolicyNotClaimable();
        uint256 withdrawableAmount = amount * (100 - s_healthPolicyParams.copaymentPercentage);
        if (withdrawableAmount >= address(this).balance) {
            //Fund the contract
        }
        s_policy.policyHolder.policyHolderWalletAddress.transfer(withdrawableAmount);
        setHasFundedForCurrentMonth(true);
    }
}
