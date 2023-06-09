const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  const testArgs = [];
  log("-----------------------Deploying-----------------------------");
  const policyGeneratorContract = await deploy("PolicyGenerator", {
    from: deployer,
    args: testArgs,
    log: true,
    waitConfirmations: 1,
    gasLimit: 10000000,
  });
  log("-------------------Deployed at-----------------");
  log(policyGeneratorContract.address);
  if (!developmentChains.includes(network.name)) {
    log("-------------------Verifying-----------------");
    await verify(policyGeneratorContract.address, testArgs);
  }
};

module.exports.tags = ["PolicyGenerator", "all", "main"];
