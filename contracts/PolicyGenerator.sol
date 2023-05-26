//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

  HealthInsurancePolicy private s_healthInsurancePolicy;
  LifeInsurancePolicy private s_lifeInsurancePolicy;

  constructor() {}

  function deployPolicy(
    SharedData.Policy memory policy,
    SharedData.HealthPolicyParams memory healthPolicyParams,
    SharedData.LifePolicyParams memory lifePolicyParams
  ) public returns (address policyAddress) {
    // depending on policyType deploy contract
    address localPolicyAddress;
    if (policyType == SharedData.PolicyType.Health) {
      s_healthInsurancePolicy = new HealthInsurancePolicy(
        policy,
        healthPolicyParams
      );
      localPolicyAddress = address(s_healthInsurancePolicy);
    } else if (policyType == SharedData.PolicyType.Life) {
      s_lifeInsurancePolicy = new LifeInsurancePolicy(policy, lifePolicyParams);
      localPolicyAddress = address(s_lifeInsurancePolicy);
    }

    emit PolicyCreated(
      address(this),
      policy.policyHolder.policyHolderWalletAddress,
      policyType
    );
    return localPolicyAddress;
  }
}
