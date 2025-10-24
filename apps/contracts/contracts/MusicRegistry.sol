// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MusicRegistry is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _trackIds;
    Counters.Counter private _artistIds;
    
    struct Track {
        uint256 id;
        string title;
        string artist;
        uint256 artistId;
        uint256 duration;
        string genre;
        string coverArt;
        string audioFile;
        string ipfsHash;
        uint256 price;
        bool isStreamable;
        uint256 playCount;
        address owner;
        uint256 createdAt;
    }
    
    struct Artist {
        uint256 id;
        string name;
        string description;
        string avatar;
        address walletAddress;
        uint256 totalTracks;
        uint256 totalEarnings;
        bool isVerified;
        uint256 createdAt;
    }
    
    mapping(uint256 => Track) public tracks;
    mapping(uint256 => Artist) public artists;
    mapping(address => uint256) public artistByAddress;
    mapping(string => bool) public ipfsHashes;
    mapping(address => uint256[]) public tracksByArtist;
    
    event TrackRegistered(
        uint256 indexed trackId,
        string title,
        string artist,
        address indexed owner,
        string ipfsHash
    );
    
    event ArtistRegistered(
        uint256 indexed artistId,
        string name,
        address indexed walletAddress
    );
    
    event TrackPlayed(uint256 indexed trackId, address indexed listener);
    event TrackPurchased(uint256 indexed trackId, address indexed buyer, uint256 price);
    
    modifier onlyArtist() {
        require(artistByAddress[msg.sender] > 0, "Not a registered artist");
        _;
    }
    
    modifier trackExists(uint256 _trackId) {
        require(_trackId > 0 && _trackId <= _trackIds.current(), "Track does not exist");
        _;
    }
    
    function registerArtist(
        string memory _name,
        string memory _description,
        string memory _avatar
    ) external {
        require(artistByAddress[msg.sender] == 0, "Artist already registered");
        
        _artistIds.increment();
        uint256 artistId = _artistIds.current();
        
        artists[artistId] = Artist({
            id: artistId,
            name: _name,
            description: _description,
            avatar: _avatar,
            walletAddress: msg.sender,
            totalTracks: 0,
            totalEarnings: 0,
            isVerified: false,
            createdAt: block.timestamp
        });
        
        artistByAddress[msg.sender] = artistId;
        
        emit ArtistRegistered(artistId, _name, msg.sender);
    }
    
    function registerTrack(
        string memory _title,
        uint256 _duration,
        string memory _genre,
        string memory _coverArt,
        string memory _audioFile,
        string memory _ipfsHash,
        uint256 _price
    ) external onlyArtist {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_duration > 0, "Duration must be greater than 0");
        require(!ipfsHashes[_ipfsHash], "IPFS hash already exists");
        
        _trackIds.increment();
        uint256 trackId = _trackIds.current();
        uint256 artistId = artistByAddress[msg.sender];
        
        tracks[trackId] = Track({
            id: trackId,
            title: _title,
            artist: artists[artistId].name,
            artistId: artistId,
            duration: _duration,
            genre: _genre,
            coverArt: _coverArt,
            audioFile: _audioFile,
            ipfsHash: _ipfsHash,
            price: _price,
            isStreamable: true,
            playCount: 0,
            owner: msg.sender,
            createdAt: block.timestamp
        });
        
        ipfsHashes[_ipfsHash] = true;
        tracksByArtist[msg.sender].push(trackId);
        artists[artistId].totalTracks++;
        
        emit TrackRegistered(trackId, _title, artists[artistId].name, msg.sender, _ipfsHash);
    }
    
    function playTrack(uint256 _trackId) external trackExists(_trackId) {
        require(tracks[_trackId].isStreamable, "Track is not streamable");
        
        tracks[_trackId].playCount++;
        emit TrackPlayed(_trackId, msg.sender);
    }
    
    function purchaseTrack(uint256 _trackId) external payable trackExists(_trackId) {
        require(tracks[_trackId].price > 0, "Track is not for sale");
        require(msg.value >= tracks[_trackId].price, "Insufficient payment");
        
        address artistAddress = tracks[_trackId].owner;
        uint256 artistId = artistByAddress[artistAddress];
        
        // Transfer payment to artist
        (bool success, ) = artistAddress.call{value: msg.value}("");
        require(success, "Payment transfer failed");
        
        artists[artistId].totalEarnings += msg.value;
        
        emit TrackPurchased(_trackId, msg.sender, msg.value);
    }
    
    function updateTrackPrice(uint256 _trackId, uint256 _newPrice) external trackExists(_trackId) {
        require(tracks[_trackId].owner == msg.sender, "Not the track owner");
        tracks[_trackId].price = _newPrice;
    }
    
    function toggleStreamable(uint256 _trackId) external trackExists(_trackId) {
        require(tracks[_trackId].owner == msg.sender, "Not the track owner");
        tracks[_trackId].isStreamable = !tracks[_trackId].isStreamable;
    }
    
    function getTrack(uint256 _trackId) external view trackExists(_trackId) returns (Track memory) {
        return tracks[_trackId];
    }
    
    function getArtist(uint256 _artistId) external view returns (Artist memory) {
        require(_artistId > 0 && _artistId <= _artistIds.current(), "Artist does not exist");
        return artists[_artistId];
    }
    
    function getArtistTracks(address _artistAddress) external view returns (uint256[] memory) {
        return tracksByArtist[_artistAddress];
    }
    
    function getTotalTracks() external view returns (uint256) {
        return _trackIds.current();
    }
    
    function getTotalArtists() external view returns (uint256) {
        return _artistIds.current();
    }
    
    function verifyArtist(uint256 _artistId) external onlyOwner {
        require(_artistId > 0 && _artistId <= _artistIds.current(), "Artist does not exist");
        artists[_artistId].isVerified = true;
    }
}
