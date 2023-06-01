//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "./BaseInsurancePolicy.sol";

contract PolicyManager {
  // Errors
  error FundingError();
  error ContractTerminatedOrCancelled();
  error InvalidContractAddress();
  error IncorrectAmountSent();

  constructor() {}

  function fundContract(address payable contractAddress) public payable {
    // Get BaseContract
    BaseInsurancePolicy baseContract = BaseInsurancePolicy(contractAddress);

    // Revert if contract is terminated or cancelled
    if (
      baseContract.getIsTerminated() == false &&
      baseContract.getIsPolicyActive() == false
    ) {
      revert ContractTerminatedOrCancelled();
    }
    if (contractAddress != address(0)) {
      revert InvalidContractAddress();
    }
    if (msg.value > baseContract.getPremiumToBePaid()) {
      revert IncorrectAmountSent();
    }

    // Send the funds to the specified contract
    (bool success, ) = contractAddress.call{ value: msg.value }("");
    if (success) {
      baseContract.setHasFundedForCurrentMonth(true);
    } else {
      revert FundingError();
    }
  } 
}
