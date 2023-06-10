const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
        callbackGasLimit: "500000", // 500,000 gas
        priceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331", // for eth to usd conversion
        
    },
    5: {
        name: "goerli",
        callbackGasLimit: "500000", // 500,000 gas
        _link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        _oracle: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
        priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    1: {
        name: "mainnet",
        _link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        callbackGasLimit: "500000", // 500,000 gas
        priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // for eth to usd conversion
    },
    80001: {
        name: "mumbai",
        _link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        callbackGasLimit: "500000", // 500,000 gas
        _oracle: "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3",
        priceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", // for eth to usd conversion
    },
    11155111: {
        name: "sepolia",
        _link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        callbackGasLimit: "500000", // 500,000 gas
        _oracle: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        priceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // for eth to usd conversion
    },
    137: {
        name: "polygon",
        _link: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        callbackGasLimit: "500000", // 500,000 gas
        priceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    },
}

const developmentChains = ["hardhat", "localhost", "polygon"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const DECIMALS = "18"
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
