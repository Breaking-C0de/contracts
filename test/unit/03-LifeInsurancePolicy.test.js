const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("LifeInsurancePolicy Contract Test", function () {
          console.log(network.name)
          let LifeInsurancePolicyContract, deployer
          beforeEach(async () => {
              await deployments.fixture(["LifeInsurancePolicy"])
              deployer = (await getNamedAccounts()).deployer
              LifeInsurancePolicyContract = await ethers.getContract(
                  "LifeInsurancePolicy",
                  deployer
              )
          })
          it("Should transfer contract funds according to shares to the nominees upon withdrawal", async function () {
              const s_lifePolicyParams = await LifeInsurancePolicyContract.getLifePolicyParams()
              const nominee1 =
                  s_lifePolicyParams.nominees[0].nomineeDetails.policyHolderWalletAddress
              console.log(nominee1)
              const oldBalance1 = await ethers.provider.getBalance(
                  s_lifePolicyParams.nominees[0].nomineeDetails.policyHolderWalletAddress
              )
              const oldBalance2 = await ethers.provider.getBalance(
                  s_lifePolicyParams.nominees[1].nomineeDetails.policyHolderWalletAddress
              )
              const tx1 = await LifeInsurancePolicyContract.connect(nominee1).withdraw()
              const tx = LifeInsurancePolicyContract.connect(nominee1).withdraw()
              await expect(tx).to.be.revertedWith("PolicyNomineeNotFound") // Replace 'Error message' with the expected error message or leave it empty for any revert error
              const txReciept = await tx.wait(1)

              const newBalance1 = await ethers.provider.getBalance(
                  s_lifePolicyParams.nominees[0].nomineeDetails.policyHolderWalletAddress
              )
              const newBalance2 = await ethers.provider.getBalance(
                  s_lifePolicyParams.nominees[1].nomineeDetails.policyHolderWalletAddress
              )

              assert(newBalance1 > oldBalance1)
          })

          it("Should get the correct policy details", async function () {
              const s_lifePolicyParams = await LifeInsurancePolicyContract.getLifePolicyParams()

              assert(s_lifePolicyParams.policyHolderWalletAddress == deployer)
          })

          it("Should set the termination status correctly", async function () {
              const tx = await LifeInsurancePolicyContract.connect(deployer).setTermination(true)
              await tx.wait(1)
              const s_lifePolicyParamsAfter =
                  await LifeInsurancePolicyContract.getLifePolicyParams()
              assert(s_lifePolicyParamsAfter.isTerminated == true)
          })

          it("Should set the policy active status correctly", async function () {
              const tx = await LifeInsurancePolicyContract.connect(deployer).setPolicyActive(true)
              await tx.wait(1)
              const s_lifePolicyParamsAfter =
                  await LifeInsurancePolicyContract.getLifePolicyParams()
              assert(s_lifePolicyParamsAfter.isPolicyActive == true)
          })

          it("Should set the claimable status correctly", async function () {
              const tx = await LifeInsurancePolicyContract.connect(deployer).setClaimable(true)
              await tx.wait(1)
              const s_lifePolicyParamsAfter =
                  await LifeInsurancePolicyContract.getLifePolicyParams()
              assert(s_lifePolicyParamsAfter.isClaimable == true)
          })

          it("Should set the already claimed status correctly", async function () {
              const tx = await LifeInsurancePolicyContract.connect(deployer).setAlreadyClaimed(true)
              await tx.wait(1)
              const s_lifePolicyParamsAfter =
                  await LifeInsurancePolicyContract.getLifePolicyParams()
              assert(s_lifePolicyParamsAfter.isAlreadyClaimed == true)
          })

          it("Should set funding status correctly", async function () {
              const tx = await LifeInsurancePolicyContract.connect(deployer).setFunding(true)
              await tx.wait(1)
              const s_lifePolicyParamsAfter =
                  await LifeInsurancePolicyContract.getLifePolicyParams()
              assert(s_lifePolicyParamsAfter.isFunding == true)
          })
      })
