//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "./BaseInsurancePolicy.sol";

contract PolicyManager {
    //Events
    event PolicyFunded(address indexed policyAddress, uint256 indexed amountFunded);

    event Withdrawn(
        address indexed policyAddress,
        address indexed policyHolderAddress,
        uint256 indexed amountWithdrawn
    );
    // Errors
    error FundingError();
    error ContractTerminatedOrCancelled();
    error InvalidContractAddress();
    error IncorrectAmountSent();

    //private address state variable
    address payable private s_owner;

    constructor() {
        s_owner = payable(msg.sender);
    }

    /**
    @dev function addFundToContract
    @param  contractAddress the contractAddress which we need to fund
    @notice this functions is used to fund the contract in any case
    */
    function addFundToContract(address payable contractAddress) public payable {
      if(contractAddress != address(0)){
          revert InvalidContractAddress();
      }
      // Send the funds to the specified contract
        (bool success, ) = contractAddress.call{value: msg.value}("");
        if (success) {
            baseContract.sethasFundedForCurrentInterval(true);
        } else {
            revert FundingError();
        }
        emit PolicyFunded(contractAddress, msg.value);
    }

    /**
    @dev function fundPremiumToContract
    @param contractAddress the contractAddress which we need to fund
    @notice this function is used to fund the premium to the contract
     */
    function fundPremiumToContract(address payable contractAddress) public payable {
        // Get BaseContract
        BaseInsurancePolicy baseContract = BaseInsurancePolicy(contractAddress);

        // Revert if contract is terminated or cancelled
        if (baseContract.getIsTerminated() == false && baseContract.getIsPolicyActive() == false) {
            revert ContractTerminatedOrCancelled();
        }
        if (contractAddress != address(0)) {
            revert InvalidContractAddress();
        }
        if (msg.value > baseContract.getPremiumToBePaid()) {
            revert IncorrectAmountSent();
        }

        // Send the funds to the specified contract
        (bool success, ) = contractAddress.call{value: msg.value}("");
        if (success) {
            baseContract.sethasFundedForCurrentInterval(true);
        } else {
            revert FundingError();
        }
        emit PolicyFunded(contractAddress, msg.value);
    }

    function withdrawFundFromContract(address payable contractAddress) public payable {
        // Get BaseContract
        BaseInsurancePolicy baseContract = BaseInsurancePolicy(contractAddress);

        // Revert if contract is terminated or cancelled
        if (baseContract.getIsTerminated() == false && baseContract.getIsPolicyActive() == false) {
            revert ContractTerminatedOrCancelled();
        }
        if (contractAddress != address(0)) {
            revert InvalidContractAddress();
        }
        // getting the amount to be withdrawn
        // Withdraw the funds from the specified contract
        baseContract.withdraw();
        emit Withdrawn(
            contractAddress,
            baseContract.getPolicyHolderAddress(),
            
        );
    }
}
