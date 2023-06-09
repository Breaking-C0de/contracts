const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, DECIMALS } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("PolicyManager", function () {
          let policyGeneratorContract, deployer, user, policyManagerContract, healthPolicyContract
          beforeEach(async () => {
              let accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["main"])
              policyGeneratorContract = await ethers.getContract("PolicyGenerator")
              policyManagerContract = await ethers.getContract("PolicyManager")
              const testArgs = [
                  {
                      policyHolder: {
                          name: "_policyHolder",
                          dateOfBirth: "1/1/1",
                          gender: "homosexual dragon",
                          homeAddress: "dragon raja land",
                          phoneNumber: "123456789",
                          email: "homodragon@phobo.com",
                          occupation: "homodragonkiller",
                          pronouns: "mighty/almighty",
                          policyHolderWalletAddress: accounts[1].address,
                      },
                      // in seconds probably
                      policyTenure: 1800,
                      gracePeriod: 15,
                      timeInterval: 600,
                      timeBeforeCommencement: 60,
                      premiumToBePaid: ethers.utils.parseEther("1"),
                      totalCoverageByPolicy: ethers.utils.parseEther("1000"),
                      hasClaimed: false,
                      isPolicyActive: true,
                      isClaimable: false,
                      isTerminated: false,
                      hasFundedForCurrentInterval: false,
                      revivalRule: {
                          revivalPeriod: 300,
                          revivalAmount: ethers.utils.parseEther("5"),
                      },
                      policyDetails: "This is a Dragon Contract",
                      policyType: 1, // Health
                      policyManagerAddress: policyManagerContract.address,
                  },
                  {
                      copaymentPercentage: 70, // in percentage
                  },
              ]
              const tx = await policyGeneratorContract.deployHealthPolicy(testArgs[0], testArgs[1])
              const receipt = await tx.wait(1)
              const policyAddress = receipt.events[0].args[0]
              healthPolicyContract = await ethers.getContractAt(
                  "HealthInsurancePolicy",
                  policyAddress
              )
          })
          describe("", function () {})
      })
