const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    const testArgs = []
    log("-----------------------Deploying-----------------------------")
    const policyManagerContract = await deploy("PolicyManager", {
        from: deployer,
        args: testArgs,
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
        gasLimit: 10000000,
    })
    log("-------------------Deployed at-----------------")
    log(policyManagerContract.address)
    if (!developmentChains.includes(network.name)) {
        log("-------------------Verifying-----------------")
        await verify(policyManagerContract.address, testArgs)
    }
}

module.exports.tags = ["PolicyManager", "all", "main"]
