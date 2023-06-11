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
          it("Should revert with PolicyNotClaimable Error", async function () {
              const s_lifePolicyParams = await LifeInsurancePolicyContract.getLifePolicyParams()
              const nominee1 =
                  s_lifePolicyParams.nominees[0].nomineeDetails.policyHolderWalletAddress
              const lifeInsurancePolicyNominee1 = await LifeInsurancePolicyContract.connect(
                  ethers.provider.getSigner(nominee1)
              )
              // assert policy is not claimable with PolicyNotClaimable Error
              await expect(lifeInsurancePolicyNominee1.withdraw()).to.be.revertedWith(
                  "PolicyNotClaimable"
              )
          })

          it("Should get the correct policy details", async function () {
              const s_lifePolicyParams = await LifeInsurancePolicyContract.getPolicyHolderDetails()
              assert(s_lifePolicyParams.name == "Aamroh")
              assert(s_lifePolicyParams.dateOfBirth == "12/12/1912")
              assert(s_lifePolicyParams.policyHolderWalletAddress == signers[1].address)
          })

          describe("Fund-Terminate-Withdraw", function () {
              it("Should pay the premium of policy correctly", async function () {
                  const LifeInsurancePolicyOfNominee = await LifeInsurancePolicyContract.connect(
                      signers[1]
                  )
                  // get preium to be paid
                  const premiumToBePaid = await LifeInsurancePolicyOfNominee.getPremiumToBePaid()
                  // get old balance of policy holder
                  const oldBalance = await ethers.provider.getBalance(signers[1].address)
                  // get old balance of contract
                  const oldBalanceOfContract = await ethers.provider.getBalance(
                      LifeInsurancePolicyOfNominee.address
                  )
                  // pay the premium
                  const tx = await LifeInsurancePolicyOfNominee.payPremium({
                      value: premiumToBePaid.toString(),
                  })
                  await tx.wait(1)
                  // get new balance of policy holder
                  const newBalance = await ethers.provider.getBalance(signers[1].address)
                  // get new balance of contract
                  const newBalanceOfContract = await ethers.provider.getBalance(
                      LifeInsurancePolicyOfNominee.address
                  )
                  // assert new balance is less than old balance
                  assert.notEqual(newBalance.toString(), oldBalance.toString())
                  // assert new balance of contract is greater than old balance of contract
                  assert.notEqual(newBalanceOfContract.toString(), oldBalanceOfContract.toString())
              })
              it("Should terminate the policy and amount should go to manager", async function () {
                  const LifeInsurancePolicyOfNominee = await LifeInsurancePolicyContract.connect(
                      signers[1]
                  )
                  const oldBalance = await ethers.provider.getBalance(signers[0].address)
                  // get preium to be paid
                  const premiumToBePaid = await LifeInsurancePolicyOfNominee.getPremiumToBePaid()

                  const tx1 = await LifeInsurancePolicyOfNominee.payPremium({
                      value: premiumToBePaid.toString(),
                  })
                  await tx1.wait(1)
                  const tx = await LifeInsurancePolicyOfNominee.terminatePolicy()
                  await tx.wait(1)
                  const newBalance = await ethers.provider.getBalance(signers[0].address)
                  assert.notEqual(newBalance.toString(), oldBalance.toString())
              })

              it("Should withdraw after setting the policy claimable", async function () {
                  const s_lifePolicyParams = await LifeInsurancePolicyContract.getLifePolicyParams()
                  const nominee1 =
                      s_lifePolicyParams.nominees[0].nomineeDetails.policyHolderWalletAddress
                  const nominee2 =
                      s_lifePolicyParams.nominees[1].nomineeDetails.policyHolderWalletAddress
                  // connect with policyHolder
                  const LifeInsurancePolicyOfPolicyHolder =
                      await LifeInsurancePolicyContract.connect(signers[1])
                  // get old balance of policyHolder
                  const oldBalanceOfPolicyHolder = await ethers.provider.getBalance(
                      signers[1].address
                  )
                  const premiumToBePaid =
                      await LifeInsurancePolicyOfPolicyHolder.getPremiumToBePaid()

                  const tx1 = await LifeInsurancePolicyOfPolicyHolder.payPremium({
                      value: premiumToBePaid.toString(),
                  })
                  await tx1.wait(1)
                  // set claimable to true using signers[0]
                  const tx2 = await LifeInsurancePolicyContract.setClaimable(true)
                  await tx2.wait(1)
                  // get old balance of nominee1
                  const oldBalanceOfNominee1 = await ethers.provider.getBalance(nominee1)
                  // get old balance of nominee2
                  const oldBalanceOfNominee2 = await ethers.provider.getBalance(nominee2)
                  // withdraw using nominee1
                  const LifeInsurancePolicyOfNominee1 = await LifeInsurancePolicyContract.connect(
                      ethers.provider.getSigner(nominee1)
                  )
                  const tx3 = await LifeInsurancePolicyOfNominee1.withdraw()
                  await tx3.wait(1)
                  // get new balance of nominee1
                  const newBalanceOfNominee1 = await ethers.provider.getBalance(nominee1)
                  // get new balance of nominee2
                  const newBalanceOfNominee2 = await ethers.provider.getBalance(nominee2)
                  // get new balance of policyHolder
                  const newBalanceOfPolicyHolder = await ethers.provider.getBalance(
                      signers[1].address
                  )
                  // expect new balance of nominee1 to be greater than old balance of nominee1
                  expect(newBalanceOfNominee1).to.be.gt(oldBalanceOfNominee1)
                  // expect new balance of nominee2 to be greater than old balance of nominee2
                  expect(newBalanceOfNominee2).to.be.gt(oldBalanceOfNominee2)
                  // expect new balance of policyHolder to be less than old balance of policyHolder
                  expect(newBalanceOfPolicyHolder).to.be.lt(oldBalanceOfPolicyHolder)
              })
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
