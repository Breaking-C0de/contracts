const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-block")

async function call() {
    const policyManager = await ethers.getSigners()[0]
    // const policyHolder = await ethers.getSigners()[0]
    const apiCall = await ethers.getContractAt(
        "APICall",
        "0x859Df887F2c83f932557e0Ab016b9A2D21CF3Ba5"
    )
    const LifeInsurancePolicy = await ethers.getContract("LifeInsurancePolicy")
    apiCall.connect(policyManager)
    LifeInsurancePolicy.connect(policyManager)
    const apiCalltx = await apiCall.requestClaimValidationData(
        "https://api.jikan.moe/v4/anime/1/full",
        "data,approved",
        "7b5d8dd72ef74808af206b9b542c7ce3",
        "0x7Fa0999e8C2C11BAf206214225dDD9284DFE8074",
        {
            gasLimit: 1000000,
        }
    )
    const apiCallRxt = await apiCalltx.wait(1)
    const isClaimable = await LifeInsurancePolicy.getIsClaimable()
    console.log("Claim verified to be ", isClaimable)

    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

call()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
