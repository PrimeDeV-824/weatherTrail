// Contract specification and ABI encoding/decoding tests
import { assertEquals, assert } from "jsr:@std/assert";
import { ethers } from "npm:ethers";
import { FORECAST_ANCHOR_ABI, FORECAST_ANCHOR_BYTECODE } from "../js/contractAbi.js";

Deno.test("ForecastAnchor Contract - ABI and Bytecode Integrity", () => {
  // Check Bytecode exists and is valid EVM hex
  assert(FORECAST_ANCHOR_BYTECODE.startsWith("0x"), "Bytecode must start with 0x");
  assert(FORECAST_ANCHOR_BYTECODE.length > 100, "Bytecode must contain compiled EVM bytecode");

  // Create interface
  const iface = new ethers.Interface(FORECAST_ANCHOR_ABI);

  // 1. Verify anchorForecast function
  const anchorFragment = iface.getFunction("anchorForecast");
  assert(anchorFragment, "Contract must export anchorForecast function");
  assertEquals(anchorFragment.inputs.length, 3);
  assertEquals(anchorFragment.inputs[0].type, "bytes32");
  assertEquals(anchorFragment.inputs[1].type, "bytes32");
  assertEquals(anchorFragment.inputs[2].type, "uint8");

  // 2. Verify getForecast function
  const getFragment = iface.getFunction("getForecast");
  assert(getFragment, "Contract must export getForecast function");
  assertEquals(getFragment.inputs.length, 1);
  assertEquals(getFragment.inputs[0].type, "bytes32");
  assertEquals(getFragment.outputs.length, 6);
  assertEquals(getFragment.outputs[0].type, "address"); // publisher
  assertEquals(getFragment.outputs[1].type, "bytes32"); // placeHash
  assertEquals(getFragment.outputs[2].type, "uint8");   // riskLevel
  assertEquals(getFragment.outputs[3].type, "uint256"); // timestamp
  assertEquals(getFragment.outputs[4].type, "uint256"); // blockNumber
  assertEquals(getFragment.outputs[5].type, "bool");    // exists

  // 3. Verify ForecastAnchored event
  const eventFragment = iface.getEvent("ForecastAnchored");
  assert(eventFragment, "Contract must define ForecastAnchored event");
  assertEquals(eventFragment.inputs.length, 5);
  assertEquals(eventFragment.inputs[0].indexed, true); // publisher
  assertEquals(eventFragment.inputs[1].indexed, true); // forecastHash
  assertEquals(eventFragment.inputs[2].indexed, false); // placeHash
  assertEquals(eventFragment.inputs[3].indexed, false); // riskLevel
  assertEquals(eventFragment.inputs[4].indexed, false); // timestamp

  // 4. Test call encoding
  const forecastHash = ethers.keccak256(ethers.toUtf8Bytes("agra-snapshot"));
  const placeHash = ethers.keccak256(ethers.toUtf8Bytes("Agra, IN"));
  const riskLevel = 1;

  const encodedData = iface.encodeFunctionData("anchorForecast", [
    forecastHash,
    placeHash,
    riskLevel
  ]);
  assert(encodedData.startsWith("0x"), "Encoded calldata should start with 0x");

  const decoded = iface.decodeFunctionData("anchorForecast", encodedData);
  assertEquals(decoded[0], forecastHash);
  assertEquals(decoded[1], placeHash);
  assertEquals(Number(decoded[2]), riskLevel);

  // 5. Test return data decoding for getForecast
  const mockPublisher = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const mockTimestamp = 1791998000;
  const mockBlockNumber = 543210;
  const encodedResult = iface.encodeFunctionResult("getForecast", [
    mockPublisher,
    placeHash,
    riskLevel,
    mockTimestamp,
    mockBlockNumber,
    true
  ]);

  const decodedResult = iface.decodeFunctionResult("getForecast", encodedResult);
  assertEquals(decodedResult[0].toLowerCase(), mockPublisher.toLowerCase());
  assertEquals(decodedResult[1], placeHash);
  assertEquals(Number(decodedResult[2]), riskLevel);
  assertEquals(Number(decodedResult[3]), mockTimestamp);
  assertEquals(Number(decodedResult[4]), mockBlockNumber);
  assertEquals(decodedResult[5], true);
});
