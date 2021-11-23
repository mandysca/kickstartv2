const path = require ('path');
const solc = require('solc');

// fs - Gives access to file system. With fs-extra features
const fs = require('fs-extra');

// Get path to the build folder
const buildPath = path.resolve(__dirname, 'build');

// function in fs-extra module - removes everything in the folder and the folder
fs.removeSync(buildPath);

// File name
const sourceFileName = 'Campaign.sol';

// Full file name with Path
const sourceFilePath = path.resolve(__dirname, 'contracts', sourceFileName);

const source = fs.readFileSync(sourceFilePath, 'utf8');

// Parse for the compiler
var input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

// Call solc compiler to compile the file - provides both abi and evm bytecode

var output = (JSON.parse(solc.compile(JSON.stringify(input))));

// Create build folder again
fs.ensureDirSync(buildPath);

// Iterate through the contracts in the output file
// Write each contract to a separate file (both abi and interface)
for(let contract in output.contracts[sourceFileName]) {
  console.log(contract);
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    output.contracts[sourceFileName][contract]
  );
}
