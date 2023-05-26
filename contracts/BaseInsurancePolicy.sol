// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaseInsurancePolicy {
  struct HumanDetails {
    string name;
    string dateOfBirth;
    string gender;
    string homeAddress;
    string phoneNumber;
    string pronouns;
    string email;
    string occupation;
    address policyHolderWalletAddress;
  }

  struct RevivalRule {
    uint128 revivalPeriod;
    uint256 revivalAmount;
  }

  uint128 private s_polilcyTenure;
  uint128 private s_gracePeriod;
  uint128 private s_timeBeforeCommencement;

  uint256 private s_premiumToBePaid;
  uint256 private s_totalCoverageByPolicy;

  bool private s_hasClaimed;
  bool private s_isPolicyActive;
  bool private s_isClaimable;
  bool private s_isTerminated;

  HumanDetails private s_policyHolderDetails;
  RevivalRule private s_revivalRule;

  string private s_pollicyDetails;

  enum PolicyType {
    Life,
    Health
  }

  PolicyType private s_policyType;

  constructor(
    HumanDetails memory policyHolderDetails,
    uint128 polilcyTenure,
    uint128 gracePeriod,
    uint128 timeBeforeCommencement,
    uint256 premiumToBePaid,
    uint256 totalCoverageByPolicy,
    string memory policyDetails,
    uint128 revivalPeriod,
    uint256 revivalAmount,
    PolicyType policyType
  ) {
    s_policyHolderDetails.name = policyHolderDetails.name;
    s_policyHolderDetails.dateOfBirth = policyHolderDetails.dateOfBirth;
    s_policyHolderDetails.gender = policyHolderDetails.gender;
    s_policyHolderDetails.homeAddress = policyHolderDetails.homeAddress;
    s_policyHolderDetails.phoneNumber = policyHolderDetails.phoneNumber;
    s_policyHolderDetails.pronouns = policyHolderDetails.pronouns;
    s_policyHolderDetails.email = policyHolderDetails.email;
    s_policyHolderDetails.occupation = policyHolderDetails.occupation;
    s_policyHolderDetails.policyHolderWalletAddress = policyHolderDetails
      .policyHolderWalletAddress;
    s_polilcyTenure = polilcyTenure;
    s_gracePeriod = gracePeriod;
    s_timeBeforeCommencement = timeBeforeCommencement;
    s_premiumToBePaid = premiumToBePaid;
    s_totalCoverageByPolicy = totalCoverageByPolicy;
    s_pollicyDetails = policyDetails;
    s_hasClaimed = false;
    s_isClaimable = false;
    s_isPolicyActive = true;
    s_isTerminated = false;
    s_revivalRule.revivalPeriod = revivalPeriod;
    s_revivalRule.revivalAmount = revivalAmount;
    s_policyType = policyType;
  }

  // Setter functions

  function setTermination(bool isTerminate) internal {
    s_isTerminated = isTerminate;
  }

  function setClaimable(bool isClaimable) internal {
    s_isClaimable = isClaimable;
  }

  function setClaimed(bool hasClaimed) internal {
    s_hasClaimed = hasClaimed;
  }

  function setPolicyActive(bool isPolicyActive) internal {
    s_isPolicyActive = isPolicyActive;
  }

  // getter functions
  function getPolicyHolderDetails() public view returns (HumanDetails memory) {
    return s_policyHolderDetails;
  }

  function getPolicyTenure() public view returns (uint128) {
    return s_polilcyTenure;
  }

  function getGracePeriod() public view returns (uint128) {
    return s_gracePeriod;
  }

  function getTimeBeforeCommencement() public view returns (uint128) {
    return s_timeBeforeCommencement;
  }

  function getPremiumToBePaid() public view returns (uint256) {
    return s_premiumToBePaid;
  }

  function getTotalCoverageByPolicy() public view returns (uint256) {
    return s_totalCoverageByPolicy;
  }

  function getPolicyDetails() public view returns (string memory) {
    return s_pollicyDetails;
  }

  function getRevivalRule() public view returns (RevivalRule memory) {
    return s_revivalRule;
  }

  function getHasClaimed() public view returns (bool) {
    return s_hasClaimed;
  }

  function getIsPolicyActive() public view returns (bool) {
    return s_isPolicyActive;
  }

  function getIsClaimable() public view returns (bool) {
    return s_isClaimable;
  }

  function getIsTerminated() public view returns (bool) {
    return s_isTerminated;
  }

  function getPolicyHolderWalletAddress() public view returns (address) {
    return s_policyHolderDetails.policyHolderWalletAddress;
  }

  function getPolicyType() public view returns (PolicyType) {
    return s_policyType;
  }
}
