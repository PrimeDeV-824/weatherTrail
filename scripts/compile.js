// Compilation script for ForecastAnchor.sol using solc
import solc from "npm:solc";
import * as path from "node:path";
import * as fs from "node:fs";

const contractPath = path.resolve("./contracts/ForecastAnchor.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "ForecastAnchor.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

console.log("Compiling ForecastAnchor.sol...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasFatal = false;
  for (const err of output.errors) {
    console.warn(err.formattedMessage);
    if (err.severity === "error") hasFatal = true;
  }
  if (hasFatal) {
    console.error("Compilation failed with errors.");
    Deno.exit(1);
  }
}

const contract = output.contracts["ForecastAnchor.sol"]["ForecastAnchor"];
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

const exportContent = `// Auto-generated from contracts/ForecastAnchor.sol
export const FORECAST_ANCHOR_ABI = ${JSON.stringify(abi, null, 2)};
export const FORECAST_ANCHOR_BYTECODE = "0x${bytecode}";
// Default public testnet deployment address (Sepolia). If not yet deployed, user can deploy using scripts/deploy.js
export const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
`;

if (!fs.existsSync("./js")) {
  fs.mkdirSync("./js", { recursive: true });
}

fs.writeFileSync("./js/contractAbi.js", exportContent);
console.log("Successfully compiled! ABI and Bytecode written to js/contractAbi.js");
