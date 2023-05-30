const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PolicyGenerator", function () {
  let PolicyGenerator;
  let HealthInsurancePolicy;
  let LifeInsurancePolicy;
  let policyGenerator;
  let healthInsurancePolicy;
  let lifeInsurancePolicy;
  let owner;
  let policyHolder;

  before(async function () {
    // Get contract artifacts
    PolicyGenerator = await ethers.getContractFactory("PolicyGenerator");
    HealthInsurancePolicy = await ethers.getContractFactory(
      "HealthInsurancePolicy"
    );
    LifeInsurancePolicy = await ethers.getContractFactory(
      "LifeInsurancePolicy"
    );

    // Deploy contracts
    policyGenerator = await PolicyGenerator.deploy();
    healthInsurancePolicy = await HealthInsurancePolicy.deploy();
    lifeInsurancePolicy = await LifeInsurancePolicy.deploy();

    // Get accounts
    [owner, policyHolder] = await ethers.getSigners();
  });

  it("should deploy a HealthInsurancePolicy", async function () {
    // Create a sample policy
    const policyType = 0; // Assuming HealthInsurancePolicy has index 0
    const policy = {
      policyHolder: {
        policyHolderWalletAddress: policyHolder.address,
        name: "John Doe",
      },
      duration: 365,
      premium: ethers.utils.parseEther("1"),
    };
    const healthPolicyParams = {
      maxCoverageAmount: ethers.utils.parseEther("100000"),
      deductibles: ethers.utils.parseEther("1000"),
    };

    // Deploy the policy
    const tx = await policyGenerator.deployPolicy(
      policy,
      healthPolicyParams,
      {},
      policyType
    );

    // Wait for the transaction to be mined
    await tx.wait();

    // Get the deployed policy address
    const deployedPolicyAddress =
      await policyGenerator.s_healthInsurancePolicy();

    // Verify that the policy was deployed successfully
    expect(await healthInsurancePolicy.owner()).to.equal(deployedPolicyAddress);
    expect(await healthInsurancePolicy.policyHolder()).to.equal(
      policyHolder.address
    );
    expect(await healthInsurancePolicy.maxCoverageAmount()).to.equal(
      healthPolicyParams.maxCoverageAmount
    );
  });

  it("should deploy a LifeInsurancePolicy", async function () {
    // Create a sample policy
    const policyType = 1; // Assuming LifeInsurancePolicy has index 1
    const policy = {
      policyHolder: {
        policyHolderWalletAddress: policyHolder.address,
        name: "Jane Smith",
      },
      duration: 730,
      premium: ethers.utils.parseEther("2"),
    };
    const lifePolicyParams = {
      beneficiary: "Alice",
      payoutAmount: ethers.utils.parseEther("500000"),
    };

    // Deploy the policy
    const tx = await policyGenerator.deployPolicy(
      policy,
      {},
      lifePolicyParams,
      policyType
    );

    // Wait for the transaction to be mined
    await tx.wait();

    // Get the deployed policy address
    const deployedPolicyAddress = await policyGenerator.s_lifeInsurancePolicy();

    // Verify that the policy was deployed successfully
    expect(await lifeInsurancePolicy.owner()).to.equal(deployedPolicyAddress);
    expect(await lifeInsurancePolicy.policyHolder()).to.equal(
      policyHolder.address
    );
    expect(await lifeInsurancePolicy.beneficiary()).to.equal(
      lifePolicyParams.beneficiary
    );
  });
});
``;
