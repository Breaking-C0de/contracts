const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, DECIMALS } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("PolicyGenerator", function () {
          let policyGeneratorContract, caller
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              ;[deployer, user] = accounts
              caller = deployer
              await deployments.fixture(["main"])
              policyGeneratorContract = await ethers.getContract("PolicyGenerator")
          })
          describe("deployPolicy Function", function () {
              it("should deploy the health policy", async function () {
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
                              policyHolderWalletAddress:
                                  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                          },
                          policyTenure: 5000,
                          gracePeriod: 15,
                          timeInterval: 30,
                          timeBeforeCommencement: 60,
                          premiumToBePaid: ethers.utils.parseEther("1"),
                          totalCoverageByPolicy: ethers.utils.parseEther("1000"),
                          hasClaimed: false,
                          isPolicyActive: true,
                          isClaimable: false,
                          isTerminated: false,
                          hasFundedForCurrentInterval: false,
                          revivalRule: {
                              revivalPeriod: 15,
                              revivalAmount: ethers.utils.parseEther("5"),
                          },
                          policyDetails: "This is a Dragon Contract",
                          policyType: 1, // Health
                          policyManagerAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                      },
                      {
                          copaymentPercentage: 69, // in percentage
                      },
                  ]
                  const tx = await policyGeneratorContract.deployHealthPolicy(
                      testArgs[0],
                      testArgs[1]
                  )
                  const receipt = await tx.wait(1)
                  const policyAddress = receipt.events[0].args[0]
                  const policy = await ethers.getContractAt("HealthInsurancePolicy", policyAddress)
                  // Get policy Type and assert if correct
                  const policyType = await policy.getPolicyType()
                  assert.equal(policyType, 1)
              })
              it("should deploy the life policy", async function () {
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
                              policyHolderWalletAddress:
                                  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                          },
                          policyTenure: 5000,
                          gracePeriod: 15,
                          timeBeforeCommencement: 60,
                          premiumToBePaid: ethers.utils.parseEther("1"),
                          totalCoverageByPolicy: ethers.utils.parseEther("1000"),
                          hasClaimed: false,
                          isPolicyActive: true,
                          isClaimable: false,
                          isTerminated: false,
                          timeInterval: 30,
                          hasFundedForCurrentInterval: false,
                          revivalRule: {
                              revivalPeriod: 15,
                              revivalAmount: ethers.utils.parseEther("5"),
                          },
                          policyDetails: "This is a Dragon Contract",
                          policyType: 0, // Life
                          policyManagerAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                      },
                      {
                          nominees: [
                              {
                                  nomineeDetails: {
                                      name: "_policyNominee",
                                      dateOfBirth: "1/2/1",
                                      gender: "homosexual dragoness",
                                      homeAddress: "dragon raja land",
                                      phoneNumber: "003456789",
                                      email: "homodragoness@phobo.com",
                                      occupation: "homodragonesskiller",
                                      pronouns: "mightyNoona/almightyNoona",
                                      policyHolderWalletAddress:
                                          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                                  },
                                  nomineeShare: 25, // in percentage
                              },
                              {
                                  nomineeDetails: {
                                      name: "_policyNominee",
                                      dateOfBirth: "1/2/1",
                                      gender: "asexual dragoness",
                                      homeAddress: "dragon raja land",
                                      phoneNumber: "003456789",
                                      email: "asexualdragon@homophobic.com",
                                      occupation: "heterodragonkiller",
                                      pronouns: "mightyOopa/almightyOopa",
                                      policyHolderWalletAddress:
                                          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                                  },
                                  nomineeShare: 75, // in percentage
                              },
                          ],
                      },
                  ]
                  const tx = await policyGeneratorContract.deployLifePolicy(
                      testArgs[0],
                      testArgs[1]
                  )
                  const receipt = await tx.wait(1)
                  const policyAddress = receipt.events[0].args[0]
                  const policy = await ethers.getContractAt("LifeInsurancePolicy", policyAddress)
                  // Get policy Type and assert if correct
                  const policyType = await policy.getPolicyType()
                  assert.equal(policyType, 0)
              })
          })
      })
