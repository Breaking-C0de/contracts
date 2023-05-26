// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";

contract BaseInsurancePolicy {
  SharedData.Policy private s_policy;

  constructor(SharedData.Policy memory policy) {
    s_policy = policy;
  }

  // Setter functions

  function setTermination(bool isTerminate) internal {
    s_policy.isTerminated = isTerminate;
  }

  function setClaimable(bool isClaimable) internal {
    s_policy.isClaimable = isClaimable;
  }

  function setClaimed(bool hasClaimed) internal {
    s_policy.hasClaimed = hasClaimed;
  }

  function setPolicyActive(bool isPolicyActive) internal {
    s_policy.isPolicyActive = isPolicyActive;
  }

  // getter functions
  function getPolicyHolderDetails()
    public
    view
    returns (SharedData.HumanDetails memory policyHolderDetails)
  {
    return s_policy.policyHolder;
  }

  function getPolicyTenure() public view returns (uint128 policyTenure) {
    return s_policy.polilcyTenure;
  }

  function getGracePeriod() public view returns (uint128 gracePeriod) {
    return s_policy.gracePeriod;
  }

  function getTimeBeforeCommencement() public view returns (uint128 time) {
    return s_policy.timeBeforeCommencement;
  }

  function getPremiumToBePaid() public view returns (uint256 premiumToBePaid) {
    return s_policy.premiumToBePaid;
  }

  function getTotalCoverageByPolicy() public view returns (uint256 coverage) {
    return s_policy.totalCoverageByPolicy;
  }

  function getPolicyDetails() public view returns (string memory policyDetails) {
    return s_policy.policyDetails;
  }

  function getRevivalRule()
    public
    view
    returns (SharedData.RevivalRule memory revivalRule)
  {
    return s_policy.revivalRule;
  }

  function getHasClaimed() public view returns (bool hasClaimed) {
    return s_policy.hasClaimed;
  }

  function getIsPolicyActive() public view returns (bool isPolicyActive) {
    return s_policy.isPolicyActive;
  }

  function getIsClaimable() public view returns (bool isClaimable) {
    return s_policy.isClaimable;
  }

  function getIsTerminated() public view returns (bool isTerminated) {
    return s_policy.isTerminated;
  }

  function getPolicyHolderWalletAddress() public view returns (address payable policyHolderWalletAddress) {
    return s_policy.policyHolder.policyHolderWalletAddress;
  }

  function getPolicyType() public view returns (SharedData.PolicyType policyType) {
    return s_policy.policyType;
  }
}
