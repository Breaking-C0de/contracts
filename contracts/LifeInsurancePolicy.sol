// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "./BaseInsurancePolicy.sol";

/**
 * @title LifeInsurancePolicy
 * @dev LifeInsurancePolicy is a contract for managing a life insurance policy
 */

contract LifeInsurancePolicy is BaseInsurancePolicy {
    SharedData.LifePOliParams private s_lifePolicyParams;

    constructor(
        SharedData.Policy memory policy,
        SharedData.LifePolicyParams memory lifePolicyParams
    ) BaseInsurancePolicy(policy) {
        s_lifePolicyParams = lifePolicyParams;
    }
}
