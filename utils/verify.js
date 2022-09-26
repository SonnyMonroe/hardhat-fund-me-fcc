const { run } = require("hardhat")
const { modules } = require("web3")

const verify = async (contractAddress, args) => {
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }

//main
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
