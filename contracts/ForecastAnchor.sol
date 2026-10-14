// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ForecastAnchor
 * @notice WeatherTrail Forecast Attestation Contract
 * @dev Records cryptographic snapshots of weather forecasts on-chain.
 * Does not claim to prove the weather is accurate; provides verifiable evidence
 * that a specific forecast snapshot was captured at a specific time by an anchor wallet.
 */
contract ForecastAnchor {
    enum RiskLevel { Low, Moderate, High, Severe }

    struct AnchorRecord {
        address publisher;
        bytes32 placeHash;
        uint8 riskLevel;
        uint256 timestamp;
        uint256 blockNumber;
    }

    // Mapping from canonical forecast hash to record
    mapping(bytes32 => AnchorRecord) public records;

    // Emitted when a forecast is successfully anchored
    event ForecastAnchored(
        address indexed publisher,
        bytes32 indexed forecastHash,
        bytes32 placeHash,
        uint8 riskLevel,
        uint256 timestamp
    );

    /**
     * @notice Anchor a weather forecast snapshot hash
     * @param forecastHash Keccak256 hash of the canonical JSON snapshot
     * @param placeHash Keccak256 hash of the location identifier (e.g. "Agra, IN")
     * @param riskLevel Calculated severity level (0 = Low, 1 = Moderate, 2 = High, 3 = Severe)
     */
    function anchorForecast(
        bytes32 forecastHash,
        bytes32 placeHash,
        uint8 riskLevel
    ) external returns (bool) {
        require(forecastHash != bytes32(0), "Invalid forecast hash");
        require(placeHash != bytes32(0), "Invalid place hash");
        require(riskLevel <= uint8(RiskLevel.Severe), "Invalid risk level (0-3)");

        records[forecastHash] = AnchorRecord({
            publisher: msg.sender,
            placeHash: placeHash,
            riskLevel: riskLevel,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        emit ForecastAnchored(
            msg.sender,
            forecastHash,
            placeHash,
            riskLevel,
            block.timestamp
        );

        return true;
    }

    /**
     * @notice Retrieve an anchored forecast by its hash
     * @param forecastHash The hash to look up
     */
    function getForecast(bytes32 forecastHash)
        external
        view
        returns (
            address publisher,
            bytes32 placeHash,
            uint8 riskLevel,
            uint256 timestamp,
            uint256 blockNumber,
            bool exists
        )
    {
        AnchorRecord memory rec = records[forecastHash];
        return (
            rec.publisher,
            rec.placeHash,
            rec.riskLevel,
            rec.timestamp,
            rec.blockNumber,
            rec.timestamp > 0
        );
    }
}
