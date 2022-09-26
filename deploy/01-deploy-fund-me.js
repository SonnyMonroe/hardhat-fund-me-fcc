// import
// main function
// calling of main function

//const { network } = require("hardhat")

// function deployFunc(hre) {
//     console.log("Hi!")
// }
// module.exports.default = deployFunc

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // when going for locallost or hardhat netowork we want to use a mock.
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [args],
        log: true,
        waitConfiorations: network.config.blockConfirmatios || 1
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("-------------------------------------")
}

module.exports.tags = ["all", "fundme"]
