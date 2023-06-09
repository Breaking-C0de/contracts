const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
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
                policyHolderWalletAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
                        name: "Aaroh 2",
                        dateOfBirth: "1/2/1",
                        gender: "homosexual dragoness",
                        homeAddress: "dragon raja land",
                        phoneNumber: "003456789",
                        email: "homodragoness@phobo.com",
                        occupation: "homodragonesskiller",
                        pronouns: "mightyNoona/almightyNoona",
                        policyHolderWalletAddress: "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B",
                    },
                    nomineeShare: 25, // in percentage
                },
                {
                    nomineeDetails: {
                        name: "Aaroh 1",
                        dateOfBirth: "1/2/1",
                        gender: "asexual dragoness",
                        homeAddress: "dragon raja land",
                        phoneNumber: "003456789",
                        email: "asexualdragon@homophobic.com",
                        occupation: "heterodragonkiller",
                        pronouns: "mightyOopa/almightyOopa",
                        policyHolderWalletAddress: "0xF2A1790753821528E7958Bdcb196Ab12949F93A7",
                    },
                    nomineeShare: 75, // in percentage
                },
            ],
        },
    ]
    log("-----------------------Deploying-----------------------------")
    const lifeInsurancePolicy = await deploy("LifeInsurancePolicy", {
        from: deployer,
        args: testArgs,
        log: true,
        waitConfirmations: 1,
    })
    log("-------------------Deployed at-----------------")
    log(lifeInsurancePolicy.address)
    if (!developmentChains.includes(network.name)) {
        log("-------------------Verifying-----------------")
        await verify(lifeInsurancePolicy.address, testArgs)
    }
}

module.exports.tags = ["LifeInsurancePolicy", "all"]
