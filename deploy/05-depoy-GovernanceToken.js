const { ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying GovernanceToken and waiting for confirmations...")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: ["GovernanceToken", "GTK", "1000000000000000000000000000"],
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log(`GovernanceToken at ${governanceToken.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceToken.address, [])
    }
    log(`Delegating to ${deployer}`)
    await delegate(governanceToken.address, deployer)
    log("Delegated!")
}

/**
 * @dev delegate function delegates the tokens to the account address given as parameter
 * @param {*the governanceTokenAddress} governanceTokenAddress
 * @param {*the account address to which the tokens are delegated to so that the account can
 * have voting power, usually deployer account should be given} delegatedAccount
 */
const delegate = async (governanceTokenAddress, delegatedAccount) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const transactionResponse = await governanceToken.delegate(delegatedAccount)
    await transactionResponse.wait(1)
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

module.exports.tags = ["all", "governor"]
