let fs = require("fs");
let solc = require("solc");
let Web3 = require("web3");

let contract = compileContract();
let web3 = createWeb3();
let sender = "0x144a15072cc1dba1221fccbbfd5dd98e4d76d79d";

deployContract(web3, contract, sender)
  .then(function () {
    console.log("Deployment Finished");
  })
  .catch(function (error) {
    console.log("error", error);
  });

function compileContract() {
  let complerInput = {
    Voter: fs.readFileSync("Voter.sol", "utf8"),
  };
  console.log("compiling the contract");
  let compiledContract = solc.compile({ sources: complerInput }, 1);
  // console.log("compiledContract", compiledContract);
  let contract = compiledContract.contracts["Voter:Voter"];
  let abi = contract.interface;
  fs.writeFileSync("abi.json", abi);
  return contract;
}
function createWeb3() {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
  return web3;
}
async function deployContract(web3, contract, sender) {
  let Voter = new web3.eth.Contract(JSON.parse(contract.interface));
  let bytecode = "0x" + contract.bytecode;
  let gasEstimate = await web3.eth.estimateGas({ data: bytecode });

  console.log("Deploying the contract");
  const contractInstance = await Voter.deploy({ data: bytecode })
    .send({
      from: sender,
      gas: gasEstimate,
    })
    .on("transactionHash", function (transactionHash) {
      console.log("transactionHash", transactionHash);
    })
    .on("confirmation", function (confirmation) {
      console.log("confirmation", confirmation);
    });

  console.log("Contract Address: ", contractInstance.options.address);
}
