// --------------------------------------------------------
// VERSION 0.4.17

// const HDWalletProvider = require('truffle-hdwallet-provider');
// const Web3 = require('web3');
// const compiledFactory = require('./build/CampaignFactory.json');

// const provider = new HDWalletProvider(
//     process.env.MNEMONIC,
//     process.env.PROVIDER_URL
// );

// const web3 = new Web3(provider)

// const deploy = async () => {
//     const accounts = await web3.eth.getAccounts();

//     console.log('Attempting to deploy from account', accounts[0]);

//     const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
//         .deploy({ data: compiledFactory.bytecode })
//         .send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0] });

//     console.log(interface);
//     console.log('Contract deployed to', result.options.address);
// };

// deploy();

// --------------------------------------------------------
// VERSION 0.8.7
const HDWalletProvider = require('truffle-hdwallet-provider');
const { ethers } = require("ethers");
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.PROVIDER_URL
);

const deploy = async () => {
    const provider2 = new ethers.providers.Web3Provider(provider);
    const accounts = await provider2.listAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const signer = provider2.getSigner();
    const factory = await new ethers.ContractFactory(compiledFactory.abi, compiledFactory.evm.bytecode, signer);
    const contract = await factory.deploy();
    const result = await contract.deployTransaction.wait();

    console.log(interface);
    console.log('Contract deployed to', result.contractAddress);
};

deploy();
