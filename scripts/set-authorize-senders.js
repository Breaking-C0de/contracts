const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-block")

async function setAuthorize() {
    const deployer = await ethers.getSigners()[0]
    const OperatorContract = await ethers.getContract("Operator", deployer)
    const authorizeSenders = ["0xBB3a70F2D49f7ad02A68Bd1E8c7453a613FCfc66"]
    console.log("Initializing authorize senders...")
    const tx = await OperatorContract.setAuthorizedSenders(authorizeSenders, {
        gasLimit: 1000000,
    })
    const txReceipt = await tx.wait(1)
    console.log(`Authorize senders set with tx hash: ${txReceipt.transactionHash}`)
    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}
setAuthorize()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
