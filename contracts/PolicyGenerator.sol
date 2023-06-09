//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

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

    function deployLifePolicy(
        SharedData.Policy memory policy,
        SharedData.LifePolicyParams memory lifePolicyParams,
        address _link,
        address _oracle,
        address priceFeed
    ) public returns (address policyAddress) {
        // depending on policyType deploy contract
        address localPolicyAddress;
        LifeInsurancePolicy s_lifeInsurancePolicy;
        s_lifeInsurancePolicy = new LifeInsurancePolicy(policy, lifePolicyParams, _link, priceFeed);
        localPolicyAddress = address(s_lifeInsurancePolicy);
        emit PolicyCreated(
            localPolicyAddress,
            policy.policyHolder.policyHolderWalletAddress,
            SharedData.PolicyType.Life
        );
        return localPolicyAddress;
    }
}
