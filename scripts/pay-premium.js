const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function pay() {
    // const policyManager = await ethers.getSigners()[0]
    const policyHolder = await ethers.getSigners()[1]
    const LifeInsurancePolicy = await ethers.getContract("LifeInsurancePolicy")
    LifeInsurancePolicy.connect(policyHolder)
    console.log("Paying Premium...")
    const amount = await LifeInsurancePolicy.getPremiumToBePaid()
    console.log(amount)
    const paymentTx = await LifeInsurancePolicy.payPremium({ gasLimit: 1000000, value: amount })
    const paymentTxReceipt = await paymentTx.wait(1)

    console.log(
        `Premium paid for ${await LifeInsurancePolicy.getPolicyHolderWalletAddress()} with tx hash: ${
            paymentTxReceipt.transactionHash
        }`
    )
    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

pay()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
