const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const MIN_DELAY = 86400 // 1 day
module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying TimeLock and waiting for confirmations...")
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], [], deployer],
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log(`TimeLock at ${timeLock.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
}

module.exports.tags = ["all", "timelock"]
