// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MusicRegistry
 * @dev Registry for music tracks with IPFS integration
 * @author HarmonyChain Team
 */
contract MusicRegistry is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _trackIds;

    struct Track {
        uint256 id;
        string ipfsHash;
        address artist;
        string title;
        string genre;
        uint256 timestamp;
        bool isActive;
        string metadataHash; // IPFS hash for additional metadata
    }

    struct Artist {
        address wallet;
        string name;
        string bio;
        string profileImageHash; // IPFS hash
        bool isVerified;
        uint256 totalTracks;
    }

    mapping(uint256 => Track) public tracks;
    mapping(address => uint256[]) public artistTracks;
    mapping(address => Artist) public artists;
    mapping(string => bool) public usedIpfsHashes;

    event TrackRegistered(
        uint256 indexed trackId,
        address indexed artist,
        string title,
        string ipfsHash
    );
    
    event ArtistRegistered(
        address indexed artist,
        string name
    );
    
    event TrackUpdated(
        uint256 indexed trackId,
        string newTitle
    );

    modifier onlyArtist() {
        require(artists[msg.sender].wallet != address(0), "Artist not registered");
        _;
    }

    modifier trackExists(uint256 _trackId) {
        require(tracks[_trackId].artist != address(0), "Track does not exist");
        _;
    }

    /**
     * @dev Register a new artist
     * @param _name Artist name
     * @param _bio Artist biography
     * @param _profileImageHash IPFS hash of profile image
     */
    function registerArtist(
        string memory _name,
        string memory _bio,
        string memory _profileImageHash
    ) external {
        require(artists[msg.sender].wallet == address(0), "Artist already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");

        artists[msg.sender] = Artist({
            wallet: msg.sender,
            name: _name,
            bio: _bio,
            profileImageHash: _profileImageHash,
            isVerified: false,
            totalTracks: 0
        });

        emit ArtistRegistered(msg.sender, _name);
    }

    /**
     * @dev Register a new music track
     * @param _ipfsHash IPFS hash of the audio file
     * @param _title Track title
     * @param _genre Track genre
     * @param _metadataHash IPFS hash of track metadata
     */
    function registerTrack(
        string memory _ipfsHash,
        string memory _title,
        string memory _genre,
        string memory _metadataHash
    ) external onlyArtist nonReentrant returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(!usedIpfsHashes[_ipfsHash], "IPFS hash already used");

        _trackIds.increment();
        uint256 trackId = _trackIds.current();

        tracks[trackId] = Track({
            id: trackId,
            ipfsHash: _ipfsHash,
            artist: msg.sender,
            title: _title,
            genre: _genre,
            timestamp: block.timestamp,
            isActive: true,
            metadataHash: _metadataHash
        });

        artistTracks[msg.sender].push(trackId);
        artists[msg.sender].totalTracks++;
        usedIpfsHashes[_ipfsHash] = true;

        emit TrackRegistered(trackId, msg.sender, _title, _ipfsHash);

        return trackId;
    }

    /**
     * @dev Get track information
     * @param _trackId Track ID
     * @return Track struct
     */
    function getTrack(uint256 _trackId) external view trackExists(_trackId) returns (Track memory) {
        return tracks[_trackId];
    }

    /**
     * @dev Get artist information
     * @param _artist Artist wallet address
     * @return Artist struct
     */
    function getArtist(address _artist) external view returns (Artist memory) {
        require(artists[_artist].wallet != address(0), "Artist not found");
        return artists[_artist];
    }

    /**
     * @dev Get all tracks by an artist
     * @param _artist Artist wallet address
     * @return Array of track IDs
     */
    function getArtistTracks(address _artist) external view returns (uint256[] memory) {
        return artistTracks[_artist];
    }

    /**
     * @dev Update track information (only by artist)
     * @param _trackId Track ID
     * @param _newTitle New title
     * @param _newGenre New genre
     */
    function updateTrack(
        uint256 _trackId,
        string memory _newTitle,
        string memory _newGenre
    ) external trackExists(_trackId) {
        require(tracks[_trackId].artist == msg.sender, "Not the track artist");
        require(bytes(_newTitle).length > 0, "Title cannot be empty");

        tracks[_trackId].title = _newTitle;
        tracks[_trackId].genre = _newGenre;

        emit TrackUpdated(_trackId, _newTitle);
    }

    /**
     * @dev Deactivate a track
     * @param _trackId Track ID
     */
    function deactivateTrack(uint256 _trackId) external trackExists(_trackId) {
        require(tracks[_trackId].artist == msg.sender, "Not the track artist");
        tracks[_trackId].isActive = false;
    }

    /**
     * @dev Verify an artist (only owner)
     * @param _artist Artist wallet address
     */
    function verifyArtist(address _artist) external onlyOwner {
        require(artists[_artist].wallet != address(0), "Artist not found");
        artists[_artist].isVerified = true;
    }

    /**
     * @dev Get total number of tracks
     * @return Total track count
     */
    function getTotalTracks() external view returns (uint256) {
        return _trackIds.current();
    }

    /**
     * @dev Get tracks by genre
     * @param _genre Genre to filter by
     * @param _limit Maximum number of tracks to return
     * @return Array of track IDs
     */
    function getTracksByGenre(string memory _genre, uint256 _limit) external view returns (uint256[] memory) {
        uint256[] memory genreTracks = new uint256[](_limit);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _trackIds.current() && count < _limit; i++) {
            if (tracks[i].isActive && 
                keccak256(bytes(tracks[i].genre)) == keccak256(bytes(_genre))) {
                genreTracks[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = genreTracks[i];
        }
        
        return result;
    }
}
