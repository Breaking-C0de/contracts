// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./PriceConvertor.sol";

abstract contract BaseInsurancePolicy is AutomationCompatible, ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    using PriceConverter for uint256;

    // events
    event PolicyFunded(uint256 amount);
    event PolicyRevived(uint256 amount);
    event PolicyClaimed(uint256 amount);
    event PolicyTerminated(uint256 amount);
    event PolicyMatured(uint256 amount);

    bytes32 private jobId;
    uint256 private fee;

    AggregatorV3Interface internal s_priceFeed;
    SharedData.Policy internal s_policy;
    uint256 private s_lastPaymentTimestamp;
    uint256 private s_startTimestamp;
    uint256 private s_timePassedSinceCreation;
    error OnlyAdminAllowed();
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
    error InsufficientBalance(uint256 contractBalance, uint256 amount);

    modifier onlyAdmin() {
        bool allowed = false;
        for (uint8 i = 0; i < admins.length; i++) {
            if (msg.sender == admins[i]) {
                allowed = true;
                break;
            }
        }
        if (!allowed) revert OnlyAdminAllowed();
        _;
    }
    modifier isNotTerminated() {
        if (s_policy.isTerminated) {
            revert PolicyTerminated();
        }
        _;
    }
    // constant decimals
    uint256 private constant DECIMALS = 10 ** 18;
    address[] public admins;

    //This array will store all those addresses which will be allowed to call certain restricted functions
    constructor(
        SharedData.Policy memory policy,
        address[] memory _admins,
        address _link,
        address _oracle,
        bytes32 _jobId,
        address priceFeed
    ) {
        s_policy = policy;
        for (uint8 i = 0; i < _admins.length; i++) {
            admins.push(_admins[i]);
        }
        admins.push(s_policy.policyHolder.policyHolderWalletAddress);
        admins.push(address(this));
        s_priceFeed = AggregatorV3Interface(priceFeed);
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        jobId = _jobId;
        fee = (1 * LINK_DIVISIBILITY) / 10;
        s_timePassedSinceCreation = 0;
    }

    // Setter functions

    function setTermination(bool isTerminate) public onlyAdmin {
        s_policy.isTerminated = isTerminate;
    }

    function setClaimable(bool isClaimable) public onlyAdmin {
        s_policy.isClaimable = isClaimable;
    }

    function setClaimed(bool hasClaimed) public onlyAdmin {
        s_policy.hasClaimed = hasClaimed;
    }

    function setPolicyActive(bool isPolicyActive) public onlyAdmin {
        s_policy.isPolicyActive = isPolicyActive;
    }

    function sethasFundedForCurrentInterval(bool hasFundedForCurrentInterval) public onlyAdmin {
        s_policy.hasFundedForCurrentInterval = hasFundedForCurrentInterval;
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

    function getPolicyDetails() public view returns (string memory policyDetails) {
        return s_policy.policyDetails;
    }

    function getRevivalRule() public view returns (SharedData.RevivalRule memory revivalRule) {
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

    function getPolicyType() public view returns (SharedData.PolicyType policyType) {
        return s_policy.policyType;
    }

    // chainlink functions
    function checkUpkeep(
        bytes calldata checkData
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
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

        upkeepNeeded = (block.timestamp - s_lastPaymentTimestamp) > s_policy.timeInterval;
        performData = "Upkeep is needed";
    }

    function performUpkeep(bytes calldata performData) external override {
        s_policy.hasFundedForCurrentInterval = false;
        s_timePassedSinceCreation += s_policy.timeInterval;
        if (s_lastPaymentTimestamp >= s_policy.policyTenure) s_policy.isTerminated = true;
        else {
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
            if (s_policy.revivalRule.revivalAmount - msg.value > (1 * DECIMALS) / 10000)
                revert RevivalAmountNotCorrect();

            // set policy to active
            s_lastPaymentTimestamp = block.timestamp;
            s_policy.isPolicyActive = true;
            return;
        }

        // if premiumToBePaid is close to msg.value then revert
        if (s_policy.premiumToBePaid - msg.value > (1 * DECIMALS) / 10000)
            revert PremiumAmountNotCorrect();

        // set lastTimestamp to current block.timestamp
        s_lastPaymentTimestamp = block.timestamp;
        s_policy.hasFundedForCurrentInterval = true;
    }

    function makeClaim() public onlyAdmin returns (bool claimed) {
        if (!s_policy.isTerminated) revert PolicyTerminated();
        if (s_policy.isPolicyActive) revert PolicyNotActive();

        // TODO: chainlink API call
        if (s_policy.isClaimable) revert PolicyNotClaimable();

        // for single claimable policies
        if (!s_policy.hasClaimed) revert PolicyAlreadyClaimed();

        s_policy.hasClaimed = true;
        return true;
    }

    function revivePolicy() public payable onlyAdmin {
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

    function terminatePolicy() public onlyAdmin {
        if (s_policy.isTerminated) revert PolicyTerminated();
        s_policy.isTerminated = true;
        s_policy.policyManagerAddress.transfer(address(this).balance);
    }

    function withdraw() public payable virtual onlyAdmin isNotTerminated {
        uint256 withdrawableAmount = s_policy.totalCoverageByPolicy;
        if (address(this).balance < withdrawableAmount)
            revert InsufficientBalance(address(this).balance, withdrawableAmount);
        s_policy.policyHolder.policyHolderWalletAddress.transfer(withdrawableAmount);
        setTermination(true);
    }

    function getPremiuminUSD() public view returns (uint256 convertedAmount) {
        uint256 ethPriceInUsd = s_policy.premiumToBePaid.getConversionRate(s_priceFeed);
        uint256 usdAmount = (s_policy.premiumToBePaid * ethPriceInUsd) / 1e18;
        return usdAmount;
    }
}
