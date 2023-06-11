const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { ethers } = require("hardhat")
const MIN_DELAY = 600 // 10 minutes
module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const signers = await ethers.getSigners()
    log("----------------------------------------------------")
    log("Deploying TimeLock and waiting for confirmations...")
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [
            MIN_DELAY,
            [signers[1].address, signers[2].address, signers[3].address, signers[4].address],
            [],
            deployer,
        ],
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log(`TimeLock at ${timeLock.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
}

module.exports.tags = ["all", "timelock", "main"]
