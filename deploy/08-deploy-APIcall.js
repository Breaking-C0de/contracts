const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const baseInsurancePolicy = await ethers.getContract("LifeInsurancePolicy")
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
    const testArgs = [link, baseInsurancePolicy.address]
    log("-----------------------Deploying-----------------------------")
    const APICallcontract = await deploy("APICall", {
        from: deployer,
        args: testArgs,
        log: true,
        waitConfirmations: networkConfig[network.config.chainId].blockConfirmations || 1,
    })
    log("-------------------Deployed at-----------------")
    log(APICallcontract.address)
    if (!developmentChains.includes(network.name)) {
        log("-------------------Verifying-----------------")
        await verify(APICallcontract.address, testArgs)
    }
}
module.exports.tags = ["all", "APICall", "main"]
