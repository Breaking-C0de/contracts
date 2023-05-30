import { expect } from "chai";
import { ethers } from "hardhat";

describe("BaseInsurancePolicy", function () {
  let baseInsurancePolicy;

  before(async function () {
    // Get contract artifacts
    const BaseInsurancePolicy = await ethers.getContractFactory(
      "BaseInsurancePolicy"
    );

    // Deploy contracts
    baseInsurancePolicy = await BaseInsurancePolicy.deploy(
        
    );
  });

  
});
