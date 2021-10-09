// const assert = require("assert");
// const ganache = require("ganache-cli");
// const Web3 = require("web3");
// const web3 = new Web3(ganache.provider());

// const compiledFactory = require("../ethereum/build/CampaignFactory.json");
// const compiledCampaign = require("../ethereum/build/Campaign.json");

// let accounts;
// let factory;
// let campaignAddress;
// let campaign;

// beforeEach(async () => {
//   accounts = await web3.eth.getAccounts();
//   factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
//     .deploy({ data: compiledFactory.bytecode })
//     .send({ from: accounts[0], gas: "1000000" });

//   await factory.methods.createCampaign("100").send({
//     from: accounts[0],
//     gas: "1000000",
//   });

//   [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

//   campaign = await new web3.eth.Contract(
//     JSON.parse(compiledCampaign.interface),
//     campaignAddress
//   );
// });

// describe("Campaigns", () => {
//   it("deploys a factory and a campaign", () => {
//     assert.ok(factory.options.address);
//     assert.ok(campaign.options.address);
//   });

//   it("marks caller as the campaign manager", async () => {
//     const manager = await campaign.methods.manager().call();
//     assert.equal(accounts[0], manager);
//   });

//   it("allows people to contribute money and marks them as approvers", async () => {
//     await campaign.methods.contribute().send({
//       value: "200",
//       from: accounts[1],
//     });
//     const isContributor = await campaign.methods.approvers(accounts[1]);
//     assert(isContributor);
//   });

//   it("requires a minimum contribution", async () => {
//     try {
//       await campaign.methods.contribute().send({
//         value: "100",
//         from: accounts[2],
//       });
//       assert(false);
//     } catch (error) {
//       assert(error);
//     }
//   });

//   it("allows a manager to make a payment request", async () => {
//     await campaign.methods
//       .createRequest("request description", '100', accounts[1])
//       .send({
//         from: accounts[0],
//         gas: "1000000",
//       });

//     const request = await campaign.methods.requests(0).call();
//     assert.equal("request description", request.description);
//   });

//   it("processes request", async () => {
//     await campaign.methods.contribute().send({
//       value: web3.utils.toWei('10', 'ether'),
//       from: accounts[0],
//     });

//     await campaign.methods
//       .createRequest("A", web3.utils.toWei('5', 'ether'), accounts[1])
//       .send({ from: accounts[0], gas: "1000000" });

//     await campaign.methods.approveRequest(0).send({
//       from: accounts[0],
//       gas: "1000000",
//     });

//     await campaign.methods.finalizeRequest(0).send({
//       from: accounts[0],
//       gas: "1000000",
//     });

//     let balance = await web3.eth.getBalance(accounts[1]);
//     balance = web3.utils.fromWei(balance, "ether");
//     balance = parseFloat(balance);

//     assert(balance > 104);
//   });
// });

// --------------------------------------------------------
// VERSION 0.8.7

const assert = require("assert");
const ganache = require("ganache-cli");
const { ethers, utils } = require("ethers");

// How to connect providers with ethers.js
// https://docs.ethers.io/v4/cookbook-providers.html#testrpc-ganache
// https://ethereum.org/es/developers/docs/apis/javascript/
// ganache.provider() o window.ethereum

const provider = new ethers.providers.Web3Provider(ganache.provider());
// const { abi, evm } = require('../compile');
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await provider.listAccounts();

  // Use one of those accounts to deploy the contract
  // web3       https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
  // ethers.js  https://docs.ethers.io/v5/api/contract/contract/
  // To create a new contract https://docs.ethers.io/v5/api/contract/contract-factory/

  const signer = provider.getSigner();
  factory = await new ethers.ContractFactory(
    compiledFactory.abi,
    compiledFactory.evm.bytecode,
    signer
  );
  factory = await factory.deploy();

  await factory.createCampaign(100);
  [campaignAddress] = await factory.getDeployedCampaigns();

  campaign = await new ethers.Contract(
    campaignAddress,
    compiledCampaign.abi,
    signer
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.address);
    assert.ok(campaign.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.manager();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.contribute({ value: "200", from: accounts[0] });

    const isContributor = await campaign.approvers(accounts[0]);
    assert(isContributor);
  });

    it("requires a minimum contribution", async () => {
    try {
      await campaign.contribute({ value: "100", from: accounts[0] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign
      .createRequest("request description", '100', accounts[1], {
        from: accounts[0]
      });

    const request = await campaign.requests(0);
    assert.equal("request description", request.description);
  });

  it("processes request", async () => {
    await campaign.contribute({
      value: utils.parseEther('10'),
      from: accounts[0],
    });

    await campaign
      .createRequest("A", utils.parseEther('5'), accounts[1], { from: accounts[0] });

    await campaign.approveRequest(0, {
      from: accounts[0]
    });

    await campaign.finalizeRequest(0, {from: accounts[0]});

    let balance = await provider.getBalance(accounts[1]);
    balance = utils.formatEther(balance);
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
