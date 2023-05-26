// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "./BaseInsurancePolicy.sol";

/**
 * @title LifeInsurancePolicy
 * @dev LifeInsurancePolicy is a contract for managing a life insurance policy
 */

contract HealthInsurancePolicy is BaseInsurancePolicy {
    SharedData.HealthPolicyParams private s_healthPolicyParams;
    constructor(
        SharedData.Policy memory policy,
        SharedData.HealthPolicyParams memory healthPolicyParams
    ) BaseInsurancePolicy(policy) {
        s_healthPolicyParams = healthPolicyParams;
    }
function getCopaymentPercentage() public view returns(uint256 copaymentPercentage){
    return s_healthPolicyParams.copaymentPercentage;
}
}

