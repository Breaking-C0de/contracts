const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    let link = ""
    if (developmentChains.includes(network.name)) {
        // get the linktoken contract
        const linkToken = await ethers.getContract("LinkToken")
        link = linkToken.address
    } else {
        link = networkConfig[chainId]["_link"]
    }

    console.log("link", link)
    console.log("priceFeed", networkConfig[network.config.chainId]["priceFeed"])
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
                policyHolderWalletAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
            policyManagerAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            admins: [
                "0xe2C47351C3175BcA8aE755A0E33826B7D300A137",
                "0x3F03b608472F698B0FfC16E3723C12274f560320",
                "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B",
                "0xF2A1790753821528E7958Bdcb196Ab12949F93A7",
            ],
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
                        policyHolderWalletAddress: "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B",
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
                        policyHolderWalletAddress: "0xF2A1790753821528E7958Bdcb196Ab12949F93A7",
                    },
                    nomineeShare: 75, // in percentage
                },
            ],
        },
        link,
        networkConfig[network.config.chainId]["priceFeed"],
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
