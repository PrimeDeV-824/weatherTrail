// Web3 Weather Forecast Attestation Module
// Connects to MetaMask (EIP-1193), builds canonical snapshot hashes,
// submits to ForecastAnchor smart contract on Sepolia, and verifies on-chain records.

import { FORECAST_ANCHOR_ABI, DEFAULT_CONTRACT_ADDRESS } from "./contractAbi.js";

export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111
export const SEPOLIA_CHAIN_ID_DEC = 11155111;

/**
 * Creates a deterministic, canonical JSON representation of the forecast snapshot
 */
export function buildCanonicalSnapshot(destination, forecast, riskLevel = 0) {
  const current = forecast?.current || {};
  const todayDaily = forecast?.daily?.[0] || {};

  // Strictly sorted keys for deterministic hashing
  const snapshotObj = {
    condition: current.description || "Clear",
    date: todayDaily.date || new Date().toISOString().slice(0, 10),
    destination: destination || "Unknown",
    maxTemp: Number((todayDaily.maxTemp ?? current.temp ?? 0).toFixed(1)),
    minTemp: Number((todayDaily.minTemp ?? current.temp ?? 0).toFixed(1)),
    precipitationProbability: Math.round(todayDaily.precipitationProbability ?? 0),
    riskLevel: Number(riskLevel)
  };

  const canonicalJson = JSON.stringify(snapshotObj, Object.keys(snapshotObj).sort());
  return { snapshotObj, canonicalJson };
}

/**
 * Compute Keccak256 hash using ethers (if available) or standard Web Crypto SHA-256 fallback
 */
export async function computeHashes(canonicalJson, destination) {
  // If ethers is available on globalThis or window
  const eth = typeof window !== "undefined" ? window.ethers : globalThis.ethers;
  if (eth) {
    const forecastHash = eth.keccak256(eth.toUtf8Bytes(canonicalJson));
    const placeHash = eth.keccak256(eth.toUtf8Bytes(destination));
    return { forecastHash, placeHash, algorithm: "keccak256" };
  }

  // Fallback to Web Crypto SHA-256 formatted as bytes32 hex
  const encoder = new TextEncoder();
  const fBuf = await crypto.subtle.digest("SHA-256", encoder.encode(canonicalJson));
  const pBuf = await crypto.subtle.digest("SHA-256", encoder.encode(destination));

  const fHex = "0x" + Array.from(new Uint8Array(fBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  const pHex = "0x" + Array.from(new Uint8Array(pBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  return { forecastHash: fHex, placeHash: pHex, algorithm: "sha256" };
}

export class Web3AttestationManager {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
    this.contractAddress = localStorage.getItem("weathertrail_contract_address") || DEFAULT_CONTRACT_ADDRESS;
  }

  isMetaMaskAvailable() {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  }

  async connectWallet() {
    if (!this.isMetaMaskAvailable()) {
      throw new Error("MetaMask is not detected. Please install MetaMask to interact with Web3 features.");
    }

    if (!window.ethers) {
      throw new Error("Ethers.js library not loaded yet.");
    }

    this.provider = new window.ethers.BrowserProvider(window.ethereum);
    const accounts = await this.provider.send("eth_requestAccounts", []);
    if (!accounts || !accounts.length) {
      throw new Error("No accounts authorized by user.");
    }

    this.account = accounts[0];
    this.signer = await this.provider.getSigner();
    const network = await this.provider.getNetwork();
    this.chainId = Number(network.chainId);

    return {
      account: this.account,
      chainId: this.chainId,
      isSepolia: this.chainId === SEPOLIA_CHAIN_ID_DEC
    };
  }

  async switchToSepolia() {
    if (!this.isMetaMaskAvailable()) throw new Error("MetaMask not found");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
      });
      this.chainId = SEPOLIA_CHAIN_ID_DEC;
      return true;
    } catch (switchError) {
      // If the chain has not been added to MetaMask, request to add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: "Sepolia Test Network",
              nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org", "https://ethereum-sepolia-rpc.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"]
            }
          ]
        });
        this.chainId = SEPOLIA_CHAIN_ID_DEC;
        return true;
      }
      throw switchError;
    }
  }

  async anchorForecast(forecastHash, placeHash, riskLevel, onProgress = () => {}) {
    if (!this.signer) {
      await this.connectWallet();
    }

    if (this.chainId !== SEPOLIA_CHAIN_ID_DEC) {
      onProgress("Switching to Sepolia testnet...");
      await this.switchToSepolia();
    }

    if (!this.contractAddress || !this.contractAddress.startsWith("0x")) {
      throw new Error("Contract address is not configured. Please set the deployed contract address.");
    }

    const contract = new window.ethers.Contract(
      this.contractAddress,
      FORECAST_ANCHOR_ABI,
      this.signer
    );

    onProgress("Awaiting wallet approval in MetaMask...");
    const tx = await contract.anchorForecast(forecastHash, placeHash, riskLevel);

    onProgress(`Broadcasting transaction ${tx.hash.slice(0, 10)}...`);
    const receipt = await tx.wait();

    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? "Confirmed" : "Failed",
      explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
    };
  }

  async verifyOnChain(forecastHash) {
    if (!window.ethers) throw new Error("Ethers.js required for verification");

    let readProvider = this.provider;
    if (!readProvider) {
      // Public fallback Sepolia RPC
      readProvider = new window.ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    }

    const contract = new window.ethers.Contract(
      this.contractAddress,
      FORECAST_ANCHOR_ABI,
      readProvider
    );

    const result = await contract.getForecast(forecastHash);
    return {
      publisher: result[0],
      placeHash: result[1],
      riskLevel: Number(result[2]),
      timestamp: Number(result[3]),
      blockNumber: Number(result[4]),
      exists: result[5]
    };
  }
}
