const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("LifeInsurancePolicy Contract Test", function () {
          console.log(network.name)
          let LifeInsurancePolicyContract, deployer, signers
          beforeEach(async () => {
              await deployments.fixture(["main"])
              // get signers from ethers
              signers = await ethers.getSigners()
              // get link token contract address
              const linkContract = await ethers.getContract("LinkToken")
              const link = linkContract.address
              const testArgs = [
                  {
                      policyHolder: {
                          name: "Aamroh",
                          dateOfBirth: "12/12/1912",
                          gender: "Male",
                          homeAddress: "dragon land",
                          phoneNumber: "123456789",
                          email: "dragon@drago.com",
                          occupation: "dragonkiller",
                          pronouns: "mighty/almighty",
                          policyHolderWalletAddress: signers[1].address,
                      },
                      policyTenure: 120000,
                      timeInterval: 600,
                      gracePeriod: 300,
                      timeBeforeCommencement: 120,
                      premiumToBePaid: ethers.utils.parseEther("1"),
                      totalCoverageByPolicy: ethers.utils.parseEther("1000"),
                      hasClaimed: false,
                      isPolicyActive: true,
                      isClaimable: false,
                      isTerminated: false,
                      hasFundedForCurrentInterval: false,
                      revivalRule: {
                          revivalPeriod: 400,
                          revivalAmount: ethers.utils.parseEther("5"),
                      },
                      policyDetails: "This is a Dragon Contract",
                      policyType: 0, // Life
                      policyManagerAddress: signers[0].address,
                      admins: [signers[1].address, signers[2].address, signers[3].address],
                  },
                  {
                      nominees: [
                          {
                              nomineeDetails: {
                                  name: "Kuntal",
                                  dateOfBirth: "13/12/1912",
                                  gender: "Male",
                                  homeAddress: "dragon raja land",
                                  phoneNumber: "003456789",
                                  email: "squirrelsaver@gmail.com",
                                  occupation: "squirrelprotector",
                                  pronouns: "almightyProtector",
                                  policyHolderWalletAddress: signers[2].address,
                              },
                              nomineeShare: 25, // in percentage
                          },
                          {
                              nomineeDetails: {
                                  name: "Deepak",
                                  dateOfBirth: "15/12/1912",
                                  gender: "Male",
                                  homeAddress: "dragon raja land",
                                  phoneNumber: "003456789",
                                  email: "whitedragon@gmail.com",
                                  occupation: "whitedragonkiller",
                                  pronouns: "mighty/almighty",
                                  policyHolderWalletAddress: signers[3].address,
                              },
                              nomineeShare: 75, // in percentage
                          },
                      ],
                  },
                  link,
                  networkConfig[network.config.chainId]["priceFeed"],
              ]
              // deploy the LifeinsurancePolicy contract
              await deployments.deploy("LifeInsurancePolicy", {
                  from: signers[0].address,
                  args: testArgs,
                  log: true,
                  waitConfirmations: 1,
                  gasLimit: 10000000,
              })
              deployer = (await getNamedAccounts()).deployer
              LifeInsurancePolicyContract = await ethers.getContract(
                  "LifeInsurancePolicy",
                  deployer
              )
          })
      })
