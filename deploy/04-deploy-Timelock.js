const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { ethers } = require("hardhat")
const MIN_DELAY = 600 // 10 minutes
module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const signers = await ethers.getSigners()
    let signersArray
    if (developmentChains.includes(network.name)) {
        signersArray = [
            signers[1].address,
            signers[2].address,
            signers[3].address,
            signers[4].address,
        ]
    } else {
        signersArray = [
            "0x3F03b608472F698B0FfC16E3723C12274f560320",
            "0xd0a4b73c199a070F6Ce1EfC3d189A168518771eB",
            "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B",
        ]
    }
    log("----------------------------------------------------")
    log("Deploying TimeLock and waiting for confirmations...")
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, signersArray, [], deployer],
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log(`TimeLock at ${timeLock.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
}

module.exports.tags = ["all", "timelock", "main"]
