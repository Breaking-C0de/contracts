//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// building a library for shared data
library SharedData {
    /********************* Add Custom Inputs Below *********************/

    /**
    @dev enum PolicyType
    Add Your Inherited PolicyTypes in this enum 
    */
    enum PolicyType {
        Life,
        Health
    }

    /** ------------------------------------------------------------ */
    /** Custom Struct Parameter For LifeInsurancePolicy */
    struct Nominee {
        HumanDetails nomineeDetails;
        uint128 nomineeShare;
    }

    struct LifePolicyParams {
        Nominee[] nominees;
    }
    /** ------------------------------------------------------------ */

    struct HealthPolicyParams {
        uint64 copaymentPercentage;
    }

    /********************* Do Not Edit The Code Below *********************/
    /**
    @dev struct HumanDetails
    @param name Name of the person
    @param dateOfBirth Date of birth of the person
    @param gender Gender of the person
    @param homeAddress Home address of the person
    @param phoneNumber Phone number of the person
    @param pronouns Pronouns of the person
    @param email Email of the person
    @param occupation Occupation of the person
    @param policyHolderWalletAddress Wallet address of the person
     */
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

    /**
    @dev struct RevivalRule
    @param  revivalPeriod Period for which revival of a policy is allowed in seconds
    @param revivalAmount amount needed for revival
    */
    struct RevivalRule {
        uint128 revivalPeriod;
        uint256 revivalAmount;
    }

    /**
    @dev struct Policy
    @notice This struct is used to store the policy details
    @param policyHolder This is the policy holder's details
    @param policyTenure This is the policy tenure in seconds
    @param gracePeriod This is the grace period in seconds
    @param timeBeforeCommencement This is the time before commencement in seconds
    @param timeInterval This is the time interval in seconds
    @param premiumToBePaid This is the premium to be paid
    @param totalCoverageByPolicy This is the total coverage by the policy
    @param hasClaimed This is a boolean to check if the policy has been claimed, should be set to true when policy is claimed
    @param isPolicyActive This is a boolean to check if the policy is active, different from terminated as inactive policies can be activated again
    @param isClaimable This is a boolean to check if the policy is claimable, 
    @param isTerminated This is a boolean to check if the policy is terminated, once set to true, the policy is over, no way to recover it
    @param hasFundedForCurrentInterval This is a boolean to check if the policy has been funded for the current month
    @param revivalRule This is the revival rule
    @param policyDetails This is the policy details
    @param policyType This is the policy type
    @param policyManagerAddress This is the policy manager contract address 
    @param admins This is the list of admins for the policy who are able to call certain functions
    @param governorContractAddress This is the governor contract address. If there is no governor contract, this should be set to the dead address
     */
    struct Policy {
        HumanDetails policyHolder;
        uint128 policyTenure;
        uint128 gracePeriod;
        uint128 timeBeforeCommencement; // in refer below TODO
        uint256 timeInterval; // 2630000 (in months) in seconds TODO: make input in days and convert to seconds in contract by sudip given by debajyoti
        uint256 premiumToBePaid;
        uint256 totalCoverageByPolicy;
        bool hasClaimed;
        bool isPolicyActive;
        bool isClaimable;
        bool isTerminated;
        bool hasFundedForCurrentInterval;
        RevivalRule revivalRule;
        string policyDetails;
        PolicyType policyType;
        address payable policyManagerAddress;
        address[] admins;
        address[] collaborators; // It should be dead address if there is no governor contract
    }
}
