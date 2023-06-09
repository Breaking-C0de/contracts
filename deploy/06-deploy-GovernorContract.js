const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// Governor Values
const QUORUM_PERCENTAGE = 1 // Need 1% of voters to pass
const VOTING_DELAY = 1200 // 10 minutes - after a vote passes, you have 1 hour before you can exit
const VOTING_PERIOD = 3600 // 1 hour - how long a vote is open for
const PROPOSAL_THRESHOLD = 0 // 0 votes needed to create a proposal
module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")
    const testArgs = [
        governanceToken.address,
        timeLock.address,
        QUORUM_PERCENTAGE,
        VOTING_PERIOD,
        VOTING_DELAY,
        PROPOSAL_THRESHOLD,
    ]

    log("----------------------------------------------------")
    log("Deploying GovernorContract and waiting for confirmations...")
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: testArgs,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log(`GovernorContract at ${governorContract.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governorContract.address, testArgs)
    }
}

module.exports.tags = ["all", "governor", "main"]
