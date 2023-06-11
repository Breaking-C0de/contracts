const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { moveBlocks } = require("../../utils/move-block")
const { moveTime } = require("../../utils/move-time")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("DAO Strategy Test", function () {
          let LifeInsurancePolicyContract,
              deployer,
              signers,
              GovernorContract,
              GovernanceTokenContract,
              TimeLockContract
          const MIN_DELAY = 600 // 10 minutes
          const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
          const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
          const VOTING_DELAY = 1200 // 20 minutes - after a vote passes, you have 1 hour before you can exit
          const VOTING_PERIOD = 3600 // 1 hour - how long a vote is open for
          const PROPOSAL_THRESHOLD = 0 // 0 votes needed to create a proposal
          const voteWay = 1
          beforeEach(async () => {
              await deployments.fixture(["main"])
              GovernanceTokenContract = await ethers.getContract("GovernanceToken")
              TimeLockContract = await ethers.getContract("TimeLock")
              GovernorContract = await ethers.getContract("GovernorContract")
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
                      collaborators: [TimeLockContract.address, GovernorContract.address],
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
              LifeInsurancePolicyContract = await ethers.getContract(
                  "LifeInsurancePolicy",
                  signers[0].address
              )
              // transfer ownership of LifeInsurancePolicy to Timelock
              const transferOwnershipTx = await LifeInsurancePolicyContract.transferOwnership(
                  TimeLockContract.address
              )
              await transferOwnershipTx.wait(1)
          })

          it("Should set isClaimable to true after proposal is accepted", async () => {
              // fund contract using fallback function in LifeInsurancePolicy contract with signers[0]
              const fundTx = await LifeInsurancePolicyContract.fundContract({
                  value: ethers.utils.parseEther("1000"),
              })
              await fundTx.wait(1)
              /**---------- Making a proposal to claim the contract ---------------**/
              // first call makeClaim function of LifeInsurancePolicy contract to make the claim
              // it will set hasClaimed attribute of contract to true
              const makeClaimTx = await LifeInsurancePolicyContract.makeClaim()
              await makeClaimTx.wait(1)

              // Now we will make a proposal to verify our claim
              // first encode the function call data that should be called in case proposal is accepted
              const encodedFunctionCall =
                  await LifeInsurancePolicyContract.interface.encodeFunctionData("setClaimable", [
                      true,
                  ])
              // transfer ownership of LifeInsurancePolicy to Timelock
              const transferOwnershipTx = await LifeInsurancePolicyContract.transferOwnership(
                  TimeLockContract.address
              )
              await transferOwnershipTx.wait(1)
              const proposeTx = await GovernorContract.propose(
                  [LifeInsurancePolicyContract.address],
                  [0],
                  [encodedFunctionCall],
                  "It will set isClaimable to true if it passes"
              )
              // get proposal id from the event emitted by GovernorContract
              const proposeReceipt = await proposeTx.wait(1)
              const proposalId = proposeReceipt.events[0].args.proposalId

              // get proposal state
              let proposalState = await GovernorContract.state(proposalId)
              console.log(`Current Proposal State: ${proposalState}`)
              await moveBlocks(VOTING_DELAY + 1)

              // cast vote
              const castVoteTx = await GovernorContract.castVoteWithReason(
                  proposalId,
                  voteWay,
                  "The claim seems to be valid"
              )
              await castVoteTx.wait(1)
              proposalState = await GovernorContract.state(proposalId)
              assert.equal(proposalState.toString(), "1")
              console.log(`Current Proposal State: ${proposalState}`)

              // cast another vote by some different signer
              const GovernorContractWithSigner2 = await GovernorContract.connect(signers[2])
              const castVoteTx2 = await GovernorContractWithSigner2.castVoteWithReason(
                  proposalId,
                  voteWay,
                  "The claim seems to be valid"
              )
              await castVoteTx2.wait(1)
              proposalState = await GovernorContract.state(proposalId)
              console.log(`Current Proposal State: ${proposalState}`)

              // move to the end of voting period
              await moveBlocks(VOTING_PERIOD + 1)
              // queue the proposal
              console.log("Queueing the proposal")
              const descriptionHash = ethers.utils.id(
                  "It will set isClaimable to true if it passes"
              )
              const queueTx = await GovernorContract.queue(
                  [LifeInsurancePolicyContract.address],
                  [0],
                  [encodedFunctionCall],
                  descriptionHash
              )
              await queueTx.wait(1)
              await moveTime(MIN_DELAY + 1)
              await moveBlocks(1)

              proposalState = await GovernorContract.state(proposalId)
              console.log(`Current Proposal State: ${proposalState}`)

              // execute the proposal
              console.log("Executing the proposal")
              const executeTx = await GovernorContract.execute(
                  [LifeInsurancePolicyContract.address],
                  [0],
                  [encodedFunctionCall],
                  descriptionHash
              )
              await executeTx.wait(1)
              // get the value of isClaimable
              const isClaimable = await LifeInsurancePolicyContract.getIsClaimable()
              assert.equal(isClaimable, true)
          })
      })
