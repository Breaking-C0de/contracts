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
    log("-----------------------Deploying-----------------------------")
    const healthInsurancePolicy = await deploy("HealthInsurancePolicy", {
        from: deployer,
        args: testArgs,
        log: true,
        waitConfirmations: 1,
    })
    log("-------------------Deployed at-----------------")
    log(healthInsurancePolicy.address)
    if (!developmentChains.includes(network.name)) {
        log("-------------------Verifying-----------------")
        await verify(healthInsurancePolicy.address, testArgs)
    }
}

module.exports.tags = ["HealthInsurancePolicy", "all"]
