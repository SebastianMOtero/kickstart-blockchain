/*
1. Delete enteri build folder
2. Read campaign.sol from contracts folder
3. compile both contracts with solidity compiler
4. write output to the build directory
*/

// --------------------------------------------------------
// VERSION 0.4.17

// const path = require('path');
// const fs = require('fs-extra');
// const solc = require('solc');

// // Delete build folder
// const buildPath = path.resolve(__dirname, 'build');
// fs.removeSync(buildPath);

// // Read campaign.sol
// const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
// const source = fs.readFileSync(campaignPath, 'utf8');

// // Compile both contracts
// const output = solc.compile(source, 1).contracts;

// // Write output to the build dir
// fs.ensureDirSync(buildPath);

// for (const contract in output) {
//     fs.outputJsonSync(
//         path.resolve(buildPath, contract.replace(':', '') + '.json'),
//         output[contract]
//     )
// }


// --------------------------------------------------------
// VERSION 0.8.7

const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// Delete build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Read campaign.sol
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// Compile both contracts
const input = {
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': [ "abi", "evm.bytecode"]
        }
      }
    }
  };

const output = JSON.parse(solc.compile(JSON.stringify(input)))

// Write output to the build dir
fs.ensureDirSync(buildPath);

for (const contract in output.contracts['Campaign.sol']) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        output.contracts['Campaign.sol'][contract]
    )
}