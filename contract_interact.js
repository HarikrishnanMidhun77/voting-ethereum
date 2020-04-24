let fs = require("fs");
let Web3 = require("web3");

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://127.0.0.1:8545"));
let contractAddress = "0x22fC3181D8853f78612209040C99b1CdD82CF70B";
let fromAddress = "0x144a15072cc1dba1221fccbbfd5dd98e4d76d79d";

let abiStr = fs.readFileSync("abi.json", "utf8");
let abi = JSON.parse(abiStr);

let voter = new web3.eth.Contract(abi, contractAddress);

sendTransactions()
  .then(function () {
    console.log("Done");
  })
  .catch(function (err) {
    console.log("err", err);
  });

async function sendTransactions() {
  console.log("adding option coffee");
  await voter.methods.addOption("coffee").send({ from: fromAddress });
  console.log("adding option tea");
  await voter.methods.addOption("tea").send({ from: fromAddress });

  await voter.methods.startVoting().send({ from: fromAddress, gas: 600000 });

  console.log("Voting");
  let a = await voter.methods["vote(uint256)"](0)
    .send({
      from: fromAddress,
      gas: 600000,
    })
    .catch(function (err) {
      console.log("err", err);
    });
  //console.log("errrrror", a);

  console.log("Getting Votes");
  let votes = await voter.methods.getVotes().call({ from: fromAddress });
  console.log("Votes:", votes);
}
