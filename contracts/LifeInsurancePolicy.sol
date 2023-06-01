// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "./BaseInsurancePolicy.sol";

/**
 * @title LifeInsurancePolicy
 * @dev LifeInsurancePolicy is a contract for managing a life insurance policy
 */

contract LifeInsurancePolicy is BaseInsurancePolicy {
  SharedData.LifePolicyParams private s_lifePolicyParams;

  constructor(
    SharedData.Policy memory policy,
    SharedData.LifePolicyParams memory lifePolicyParams
  ) BaseInsurancePolicy(policy) {
    // Loop over the nominees array and push it to storage
    for (uint256 i = 0; i < lifePolicyParams.nominees.length; i++) {
      s_lifePolicyParams.nominees.push(lifePolicyParams.nominees[i]);
    }
  }

  function getNominees()
    public
    view
    returns (SharedData.Nominee[] memory nominees)
  {
    return s_lifePolicyParams.nominees;
  }

  function getNominee(
    uint128 index
  ) public view returns (SharedData.Nominee memory nominee) {
    return s_lifePolicyParams.nominees[index];
  }
}
