const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
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
    const { deployer } = await getNamedAccounts()
    const testArgs = [link, "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B"]
    log("-----------------------Deploying-----------------------------")
    const OperatorContract = await deploy("Operator", {
        from: deployer,
        args: testArgs,
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log("-------------------Deployed at-----------------")
    log(OperatorContract.address)
    if (!developmentChains.includes(network.name)) {
        log("-------------------Verifying-----------------")
        await verify(OperatorContract.address, testArgs)
    }
}

module.exports.tags = ["all", "Operator", "main"]
