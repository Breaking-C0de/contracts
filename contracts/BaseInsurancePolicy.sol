// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract BaseInsurancePolicy is AutomationCompatible, ChainlinkClient {
  SharedData.Policy private s_policy;
  uint256 private s_lastPaymentTimestamp;
  uint256 private s_startTimestamp;

  error OnlyOwnerAllowed();
  error PolicyNotActive();
  error PolicyTerminated();
  error PolicyNotClaimable();
  error PolicyAlreadyClaimed();
  error PolicyNotRevivable();
  error PolicyNotFunded();
  error PolicyNotMatured();
  error PolicyNotInGracePeriod();
  error RevivalAmountNotCorrect();
  error PremiumAmountNotCorrect();
  error PolicyActive();
  modifier onlyOwner() {
    if (
      msg.sender != s_policy.policyHolder.policyHolderWalletAddress ||
      msg.sender != s_policy.policyManagerContractAddress
    ) {
      revert OnlyOwnerAllowed();
    }
    _;
  }
  // constant decimals
  uint256 private constant DECIMALS = 10 ** 18;

  constructor(SharedData.Policy memory policy) {
    s_policy = policy;
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

  function setHasFundedForCurrentMonth(
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
    return s_policy.policyTenure;
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

  // chainlink functions
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
        block.timestamp - s_lastPaymentTimestamp >
        s_policy.gracePeriod + s_policy.revivalRule.revivalPeriod //* seconds
      ) {
        upkeepNeeded = false;
        performData = "Revival period is over";
      }
    }

    upkeepNeeded =
      (block.timestamp - s_lastPaymentTimestamp) > s_policy.timeInterval;
    performData = "Upkeep is needed";
  }

  function performUpkeep(bytes calldata performData) external override {
    s_policy.hasFundedForCurrentMonth = false;

    // if gracePeriod is over then revert
    if (
      block.timestamp - s_lastPaymentTimestamp > s_policy.gracePeriod //* seconds
    ) s_policy.isPolicyActive = false;

    // if revivalPeriod is over then revert
    if (
      block.timestamp - s_lastPaymentTimestamp >
      s_policy.gracePeriod + s_policy.revivalRule.revivalPeriod //* seconds
    ) s_policy.isTerminated = true;
  }

  // fallback
  receive() external payable {
    // if policy is terminated then revert
    if (!s_policy.isTerminated) revert PolicyTerminated();

    // if policy is not active then revert
    if (!s_policy.isPolicyActive) {
      // if revivalPeriod is over then revert
      if (
        block.timestamp - s_lastPaymentTimestamp >
        s_policy.revivalRule.revivalPeriod + s_policy.gracePeriod //* seconds
      ) revert PolicyNotInGracePeriod();

      // amount should be close to revivalAmount
      if (
        s_policy.revivalRule.revivalAmount - msg.value < (1 * DECIMALS) / 10000
      ) revert RevivalAmountNotCorrect();

      // set policy to active
      s_lastPaymentTimestamp = block.timestamp;
      s_policy.isPolicyActive = true;
      return;
    }

    // if premiumToBePaid is close to msg.value then revert
    if (s_policy.premiumToBePaid - msg.value < (1 * DECIMALS) / 10000)
      revert PremiumAmountNotCorrect();

    // set lastTimestamp to current block.timestamp
    s_lastPaymentTimestamp = block.timestamp;
    s_policy.hasFundedForCurrentMonth = true;
  }

  function makeClaim() public onlyOwner {
    if (!s_policy.isTerminated) revert PolicyTerminated();
    if (s_policy.isPolicyActive) revert PolicyNotActive();

    // TODO: chainlink API call
    if (s_policy.isClaimable) revert PolicyNotClaimable();

    // for single claimable policies
    if (!s_policy.hasClaimed) revert PolicyAlreadyClaimed();

    s_policy.hasClaimed = true;
    s_policy.policyHolder.policyHolderWalletAddress.transfer(
      s_policy.totalCoverageByPolicy
    );
  }

  function revivePolicy() public payable onlyOwner {
    if (!s_policy.isTerminated) revert PolicyTerminated();
    if (!s_policy.isPolicyActive) revert PolicyActive();
    if (s_policy.hasClaimed) revert PolicyAlreadyClaimed();

    // if revivalPeriod is over then revert
    if (
      block.timestamp - s_lastPaymentTimestamp >
      s_policy.revivalRule.revivalPeriod + s_policy.gracePeriod //* seconds
    ) revert PolicyNotInGracePeriod();

    // amount should be close to revivalAmount
    if (s_policy.revivalRule.revivalAmount - msg.value < (1 * DECIMALS) / 10000)
      revert RevivalAmountNotCorrect();

    // set policy to active
    s_lastPaymentTimestamp = block.timestamp;
    s_policy.isPolicyActive = true;
  }
}
