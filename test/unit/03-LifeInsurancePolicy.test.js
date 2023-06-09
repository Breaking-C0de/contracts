const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("LifeInsurancePolicy Contract Staging Test", function () {
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
      })
