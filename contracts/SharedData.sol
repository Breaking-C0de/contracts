//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// building a library for shared data
library SharedData {
  struct HumanDetails {
    string name;
    string dateOfBirth;
    string gender;
    string homeAddress;
    string phoneNumber;
    string pronouns;
    string email;
    string occupation;
    address payable policyHolderWalletAddress;
  }
  struct RevivalRule {
    uint128 revivalPeriod;
    uint256 revivalAmount;
  }

  struct Policy {
    HumanDetails policyHolder;
    uint128 polilcyTenure;
    uint128 gracePeriod;
    uint128 timeBeforeCommencement;
    uint256 premiumToBePaid;
    uint256 totalCoverageByPolicy;
    bool hasClaimed;
    bool isPolicyActive;
    bool isClaimable;
    bool isTerminated;
    bool hasFundedForCurrentMonth;
    RevivalRule revivalRule;
    string policyDetails;
    PolicyType policyType;
    address payable policyManagerContractAddress;
  }

  enum PolicyType {
    Life,
    Health
  }

  struct Nominee {
    HumanDetails nomineeDetails;
    uint128 nomineeShare;
  }

  struct LifePolicyParams {
    Nominee[] nominees;
    uint256 maturityCoverage;
  }

  struct HealthPolicyParams {
    uint64 copaymentPercentage;
  }
}
