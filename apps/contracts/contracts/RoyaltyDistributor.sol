// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RoyaltyDistributor is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _distributionIds;
    
    struct RoyaltyDistribution {
        uint256 id;
        uint256 trackId;
        address artist;
        uint256 totalAmount;
        uint256 artistShare;
        uint256 platformShare;
        uint256 governanceShare;
        bool isDistributed;
        uint256 createdAt;
    }
    
    struct TrackRoyalty {
        uint256 trackId;
        address artist;
        uint256 totalEarnings;
        uint256 artistEarnings;
        uint256 platformEarnings;
        uint256 governanceEarnings;
        uint256 lastDistribution;
    }
    
    mapping(uint256 => RoyaltyDistribution) public distributions;
    mapping(uint256 => TrackRoyalty) public trackRoyalties;
    mapping(address => uint256) public artistEarnings;
    mapping(address => uint256) public platformEarnings;
    mapping(address => uint256) public governanceEarnings;
    
    uint256 public artistSharePercentage = 7000; // 70%
    uint256 public platformSharePercentage = 2000; // 20%
    uint256 public governanceSharePercentage = 1000; // 10%
    uint256 public constant PERCENTAGE_DENOMINATOR = 10000;
    
    address public governanceTreasury;
    
    event RoyaltyReceived(
        uint256 indexed trackId,
        address indexed artist,
        uint256 amount
    );
    
    event RoyaltyDistributed(
        uint256 indexed distributionId,
        uint256 indexed trackId,
        address indexed artist,
        uint256 artistShare,
        uint256 platformShare,
        uint256 governanceShare
    );
    
    event SharePercentagesUpdated(
        uint256 artistShare,
        uint256 platformShare,
        uint256 governanceShare
    );
    
    modifier onlyValidAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }
    
    constructor(address _governanceTreasury) onlyValidAddress(_governanceTreasury) {
        governanceTreasury = _governanceTreasury;
    }
    
    function receiveRoyalty(uint256 _trackId, address _artist) external payable {
        require(msg.value > 0, "No payment received");
        require(_artist != address(0), "Invalid artist address");
        
        // Update track royalty
        trackRoyalties[_trackId].trackId = _trackId;
        trackRoyalties[_trackId].artist = _artist;
        trackRoyalties[_trackId].totalEarnings += msg.value;
        
        emit RoyaltyReceived(_trackId, _artist, msg.value);
    }
    
    function distributeRoyalties(uint256 _trackId) external onlyOwner nonReentrant {
        TrackRoyalty storage trackRoyalty = trackRoyalties[_trackId];
        require(trackRoyalty.totalEarnings > 0, "No earnings to distribute");
        require(!distributions[_distributionIds.current() + 1].isDistributed, "Already distributed");
        
        uint256 totalAmount = trackRoyalty.totalEarnings;
        uint256 artistShare = (totalAmount * artistSharePercentage) / PERCENTAGE_DENOMINATOR;
        uint256 platformShare = (totalAmount * platformSharePercentage) / PERCENTAGE_DENOMINATOR;
        uint256 governanceShare = (totalAmount * governanceSharePercentage) / PERCENTAGE_DENOMINATOR;
        
        _distributionIds.increment();
        uint256 distributionId = _distributionIds.current();
        
        distributions[distributionId] = RoyaltyDistribution({
            id: distributionId,
            trackId: _trackId,
            artist: trackRoyalty.artist,
            totalAmount: totalAmount,
            artistShare: artistShare,
            platformShare: platformShare,
            governanceShare: governanceShare,
            isDistributed: true,
            createdAt: block.timestamp
        });
        
        // Update track royalty
        trackRoyalty.artistEarnings += artistShare;
        trackRoyalty.platformEarnings += platformShare;
        trackRoyalty.governanceEarnings += governanceShare;
        trackRoyalty.lastDistribution = block.timestamp;
        
        // Update global earnings
        artistEarnings[trackRoyalty.artist] += artistShare;
        platformEarnings[owner()] += platformShare;
        governanceEarnings[governanceTreasury] += governanceShare;
        
        // Transfer payments
        (bool success1, ) = trackRoyalty.artist.call{value: artistShare}("");
        require(success1, "Artist payment failed");
        
        (bool success2, ) = owner().call{value: platformShare}("");
        require(success2, "Platform payment failed");
        
        (bool success3, ) = governanceTreasury.call{value: governanceShare}("");
        require(success3, "Governance payment failed");
        
        // Reset track earnings
        trackRoyalty.totalEarnings = 0;
        
        emit RoyaltyDistributed(
            distributionId,
            _trackId,
            trackRoyalty.artist,
            artistShare,
            platformShare,
            governanceShare
        );
    }
    
    function updateSharePercentages(
        uint256 _artistShare,
        uint256 _platformShare,
        uint256 _governanceShare
    ) external onlyOwner {
        require(
            _artistShare + _platformShare + _governanceShare == PERCENTAGE_DENOMINATOR,
            "Total percentage must equal 100%"
        );
        
        artistSharePercentage = _artistShare;
        platformSharePercentage = _platformShare;
        governanceSharePercentage = _governanceShare;
        
        emit SharePercentagesUpdated(_artistShare, _platformShare, _governanceShare);
    }
    
    function updateGovernanceTreasury(address _newTreasury) external onlyOwner onlyValidAddress(_newTreasury) {
        governanceTreasury = _newTreasury;
    }
    
    function getTrackRoyalty(uint256 _trackId) external view returns (TrackRoyalty memory) {
        return trackRoyalties[_trackId];
    }
    
    function getDistribution(uint256 _distributionId) external view returns (RoyaltyDistribution memory) {
        return distributions[_distributionId];
    }
    
    function getArtistEarnings(address _artist) external view returns (uint256) {
        return artistEarnings[_artist];
    }
    
    function getPlatformEarnings(address _platform) external view returns (uint256) {
        return platformEarnings[_platform];
    }
    
    function getGovernanceEarnings(address _treasury) external view returns (uint256) {
        return governanceEarnings[_treasury];
    }
    
    function getTotalDistributions() external view returns (uint256) {
        return _distributionIds.current();
    }
}
