// Deployment script for ForecastAnchor to Ethereum Sepolia (or any EVM testnet)
import { ethers } from "npm:ethers";
import { FORECAST_ANCHOR_ABI, FORECAST_ANCHOR_BYTECODE } from "../js/contractAbi.js";

async function main() {
  const rpcUrl = Deno.env.get("SEPOLIA_RPC_URL") || Deno.env.get("ETH_RPC_URL");
  const privateKey = Deno.env.get("PRIVATE_KEY");

  if (!rpcUrl || !privateKey) {
    console.error("Error: Missing SEPOLIA_RPC_URL or PRIVATE_KEY environment variables.");
    console.error("Usage: SEPOLIA_RPC_URL=https://rpc.sepolia.org PRIVATE_KEY=0x... deno run -A scripts/deploy.js");
    Deno.exit(1);
  }

  console.log("Connecting to network via RPC:", rpcUrl);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const network = await provider.getNetwork();

  console.log(`Connected with deployer address: ${wallet.address}`);
  console.log(`Chain ID: ${network.chainId.toString()}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    console.error("Insufficient balance to deploy. Please fund the deployer address with Sepolia testnet ETH from a faucet.");
    Deno.exit(1);
  }

  console.log("Deploying ForecastAnchor contract...");
  const factory = new ethers.ContractFactory(FORECAST_ANCHOR_ABI, FORECAST_ANCHOR_BYTECODE, wallet);
  const contract = await factory.deploy();

  console.log(`Deployment transaction submitted: ${contract.deploymentTransaction()?.hash}`);
  console.log("Waiting for confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("====================================================");
  console.log(`ForecastAnchor deployed successfully to: ${contractAddress}`);
  console.log(`Sepolia Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("====================================================");
  console.log("Update DEFAULT_CONTRACT_ADDRESS in js/contractAbi.js or input in UI.");
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  Deno.exit(1);
});
