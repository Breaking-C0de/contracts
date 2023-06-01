// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract BaseInsurancePolicy is AutomationCompatible {
    SharedData.Policy private s_policy;
    uint256 private lastPaymentTimestamp;
    uint256 private startTimestamp;

    error OnlyOwnerAllowed();
    modifier onlyOwner() {
        if (
            msg.sender != s_policy.policyHolder.policyHolderWalletAddress ||
            msg.sender != s_policy.policyManagerContractAddress
        ) {
            revert OnlyOwnerAllowed();
        }
        _;
    }

    constructor(SharedData.Policy memory policy) {
        s_policy = policy;
    }

    function checkUpkeep(
        bytes calldata checkData 
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        // if policy is terminated then revert
        if (s_policy.isTerminated) {
            upkeepNeeded = false;
            performData = "Policy is terminated";
        }

        // if policy is not active then revert
        if (!s_policy.isPolicyActive) {
            // if revivalPeriod is over then revert
            if (
                block.timestamp - s_policy.lastPaymentTimestamp >
                s_policy.revivalRule.revivalPeriod //* seconds
            ) {
                upkeepNeeded = false;
                performData = "Revival period is over";
            }
        }

        // TODO: complete the checkUpkeep function

        upkeepNeeded = true;
        performData = "Upkeep is needed";
    }

    function performUpkeep(bytes calldata performData) external override {
        // TODO: perform upkeep

    }

    // fallback
    function() payable {
        require(msg.data.length == 0) revert("Invalid function call");

        // if policy is terminated then revert
        require (!s_policy.isTerminated) revert("Policy is terminated");

        // if policy is not active then revert
        if (!s_policy.isPolicyActive) {
            // amount should be close to revivalAmount
            require (s_policy.revivalRule.revivalAmount - msg.value < 0.0001)
                revert("Revival amount is not correct");

            // if revivalPeriod is over then revert
            require (
                block.timestamp - s_policy.lastPaymentTimestamp >
                s_policy.revivalRule.revivalPeriod //* seconds
            ) revert("Revival period is over");
        }

        // if premiumToBePaid is close to msg.value then revert
        require (s_policy.premiumToBePaid - msg.value < 0.0001)
            revert("Premium amount is not correct");

        // set lastTimestamp to current block.timestamp
        lastPaymentTimestamp = block.timestamp;
        s_policy.hasFundedForCurrentMonth = true;
    }

    // Setter functions

    function setTermination(bool isTerminate) public onlyOwner {
        s_policy.isTerminated = isTerminate;
    }

    function setClaimable(bool isClaimable) public onlyOwner {
        s_policy.isClaimable = isClaimable;
    }

    function setClaimed(bool hasClaimed) public onlyOwner {
        s_policy.hasClaimed = hasClaimed;
    }

    function setPolicyActive(bool isPolicyActive) public onlyOwner {
        s_policy.isPolicyActive = isPolicyActive;
    }

    function (
        bool hasFundedForCurrentMonth
    ) public onlyOwner {
        s_policy.hasFundedForCurrentMonth = hasFundedForCurrentMonth;
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

    function getPremiumToBePaid()
        public
        view
        returns (uint256 premiumToBePaid)
    {
        return s_policy.premiumToBePaid;
    }

    function getTotalCoverageByPolicy() public view returns (uint256 coverage) {
        return s_policy.totalCoverageByPolicy;
    }

    function getPolicyDetails()
        public
        view
        returns (string memory policyDetails)
    {
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

    function getPolicyHolderWalletAddress()
        public
        view
        returns (address payable policyHolderWalletAddress)
    {
        return s_policy.policyHolder.policyHolderWalletAddress;
    }

    function getPolicyType()
        public
        view
        returns (SharedData.PolicyType policyType)
    {
        return s_policy.policyType;
    }
}
