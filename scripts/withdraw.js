const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-block")

async function withdraw() {
    const policyManager = await ethers.getSigners()[0]
    const policyNominee = await ethers.getSigners()[2]
    const LifeInsurancePolicy = await ethers.getContract("LifeInsurancePolicy")
    LifeInsurancePolicy.connect(policyManager)
    const setClaimableTx = await LifeInsurancePolicy.setClaimable(true)
    await setClaimableTx.wait(1)
    console.log("Claimable set to true")
    const LifeInsurancePolicy2 = await ethers.getContract("LifeInsurancePolicy")
    LifeInsurancePolicy2.connect(policyNominee)
    console.log("Withdrawing...")
    const withdrawTx = await LifeInsurancePolicy2.withdraw({ gasLimit: 1000000 })
    const withdrawTxReceipt = await withdrawTx.wait(1)

    console.log(`Premium withdrawn for Nominees`)
     
    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

withdraw()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
