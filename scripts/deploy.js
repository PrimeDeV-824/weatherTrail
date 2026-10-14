// Deployment script for ForecastAnchor to Ethereum Sepolia (or any EVM testnet)
import { ethers } from "npm:ethers";
import * as fs from "node:fs";
import { FORECAST_ANCHOR_ABI, FORECAST_ANCHOR_BYTECODE } from "../js/contractAbi.js";

const RELIABLE_SEPOLIA_RPCS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://sepolia.drpc.org",
  "https://1rpc.io/sepolia",
  "https://gateway.tenderly.co/public/sepolia"
];

async function getWorkingProvider(preferredRpc) {
  const candidates = [];
  if (preferredRpc && preferredRpc !== "https://rpc.sepolia.org") {
    candidates.push(preferredRpc);
  }
  candidates.push(...RELIABLE_SEPOLIA_RPCS);

  for (const rpc of candidates) {
    try {
      console.log(`Connecting to network via RPC: ${rpc}`);
      const provider = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true });
      const network = await provider.getNetwork();
      console.log(`Successfully connected! Chain ID: ${network.chainId.toString()}`);
      return { provider, rpcUrl: rpc };
    } catch (err) {
      console.warn(`RPC ${rpc} failed (${err.message?.slice(0, 100)}). Trying next candidate...`);
    }
  }

  throw new Error("Unable to connect to any Sepolia RPC. Please verify your internet connection.");
}

async function main() {
  const envRpc = Deno.env.get("SEPOLIA_RPC_URL") || Deno.env.get("ETH_RPC_URL");
  let privateKey = Deno.env.get("PRIVATE_KEY");

  if (!privateKey) {
    console.error("Error: Missing PRIVATE_KEY environment variable in .env.");
    console.error("Usage: Ensure PRIVATE_KEY=0x... is defined in your .env file.");
    Deno.exit(1);
  }

  // Ensure 0x prefix on private key
  privateKey = privateKey.trim();
  if (!privateKey.startsWith("0x") && privateKey.length === 64) {
    privateKey = "0x" + privateKey;
  }

  const { provider, rpcUrl } = await getWorkingProvider(envRpc);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`Connected with deployer address: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} SepoliaETH`);

  if (balance === 0n) {
    console.error("\n[!] Insufficient balance to deploy.");
    console.error(`Your deployer address ${wallet.address} has 0 SepoliaETH.`);
    console.error("Please obtain free testnet Sepolia ETH from one of these faucets:");
    console.error(" - https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
    console.error(" - https://sepolia-faucet.pk910.de/");
    console.error(" - https://faucets.chain.link/sepolia");
    Deno.exit(1);
  }

  console.log("Deploying ForecastAnchor contract...");
  const factory = new ethers.ContractFactory(FORECAST_ANCHOR_ABI, FORECAST_ANCHOR_BYTECODE, wallet);
  const contract = await factory.deploy();

  console.log(`Deployment transaction submitted: ${contract.deploymentTransaction()?.hash}`);
  console.log("Waiting for block confirmation on Sepolia...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("\n====================================================");
  console.log(`ForecastAnchor deployed successfully to: ${contractAddress}`);
  console.log(`Sepolia Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("====================================================");

  // Automatically update js/contractAbi.js with new default address
  try {
    const abiFileContent = `// Auto-generated from contracts/ForecastAnchor.sol
export const FORECAST_ANCHOR_ABI = ${JSON.stringify(FORECAST_ANCHOR_ABI, null, 2)};
export const FORECAST_ANCHOR_BYTECODE = "${FORECAST_ANCHOR_BYTECODE}";
// Deployed contract address on Ethereum Sepolia
export const DEFAULT_CONTRACT_ADDRESS = "${contractAddress}";
`;
    fs.writeFileSync("./js/contractAbi.js", abiFileContent);
    console.log("Updated DEFAULT_CONTRACT_ADDRESS in js/contractAbi.js to the new deployed address.");
  } catch (err) {
    console.warn("Notice: Could not automatically write to js/contractAbi.js:", err.message);
  }
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  Deno.exit(1);
});
