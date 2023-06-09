//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "./HealthInsurancePolicy.sol";
import "./LifeInsurancePolicy.sol";
import "./BaseInsurancePolicy.sol";
import "./SharedData.sol";

contract PolicyGenerator {
    // Event to be emitted when a new policy is created
    event PolicyCreated(
        address indexed policyAddress,
        address indexed policyHolderAddress,
        SharedData.PolicyType indexed policyType
    );

    constructor() {}

    function deployHealthPolicy(
        SharedData.Policy memory policy,
        SharedData.HealthPolicyParams memory healthPolicyParams
    ) public returns (address policyAddress) {
        // depending on policyType deploy contract
        address localPolicyAddress;
        HealthInsurancePolicy s_healthInsurancePolicy;
        s_healthInsurancePolicy = new HealthInsurancePolicy(policy, healthPolicyParams);
        localPolicyAddress = address(s_healthInsurancePolicy);
        emit PolicyCreated(
            address(this),
            policy.policyHolder.policyHolderWalletAddress,
            SharedData.PolicyType.Health
        );
        return localPolicyAddress;
    }

    function deployLifePolicy(
        SharedData.Policy memory policy,
        SharedData.LifePolicyParams memory lifePolicyParams
    ) public returns (address policyAddress) {
        // depending on policyType deploy contract
        address localPolicyAddress;
        LifeInsurancePolicy s_lifeInsurancePolicy;
        s_lifeInsurancePolicy = new LifeInsurancePolicy(policy, lifePolicyParams);
        localPolicyAddress = address(s_lifeInsurancePolicy);
        emit PolicyCreated(
            address(this),
            policy.policyHolder.policyHolderWalletAddress,
            SharedData.PolicyType.Life
        );
        return localPolicyAddress;
    }
}
