// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Override supportsInterface to resolve conflicts
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    struct NFTItem {
        uint256 tokenId;
        address creator;
        address owner;
        uint256 price;
        bool isListed;
        uint256 trackId;
        uint256 createdAt;
    }
    
    mapping(uint256 => NFTItem) public nftItems;
    mapping(uint256 => bool) public trackToNFT;
    mapping(address => uint256[]) public nftsByOwner;
    
    uint256 public listingFee = 0.001 ether;
    uint256 public platformFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 indexed trackId,
        string tokenURI
    );
    
    event NFTListed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 price
    );
    
    event NFTUnlisted(uint256 indexed tokenId, address indexed owner);
    
    event NFTPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    constructor() ERC721("HarmonyChain Music NFT", "HCMN") {}
    
    function mintNFT(
        address _to,
        string memory _tokenURI,
        uint256 _trackId,
        uint256 _price
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= listingFee, "Insufficient listing fee");
        require(!trackToNFT[_trackId], "NFT already exists for this track");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        nftItems[tokenId] = NFTItem({
            tokenId: tokenId,
            creator: msg.sender,
            owner: _to,
            price: _price,
            isListed: _price > 0,
            trackId: _trackId,
            createdAt: block.timestamp
        });
        
        trackToNFT[_trackId] = true;
        nftsByOwner[_to].push(tokenId);
        
        emit NFTMinted(tokenId, msg.sender, _trackId, _tokenURI);
        
        if (_price > 0) {
            emit NFTListed(tokenId, _to, _price);
        }
        
        return tokenId;
    }
    
    function listNFT(uint256 _tokenId, uint256 _price) external {
        require(_exists(_tokenId), "NFT does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the NFT owner");
        require(_price > 0, "Price must be greater than 0");
        
        nftItems[_tokenId].price = _price;
        nftItems[_tokenId].isListed = true;
        
        emit NFTListed(_tokenId, msg.sender, _price);
    }
    
    function unlistNFT(uint256 _tokenId) external {
        require(_exists(_tokenId), "NFT does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the NFT owner");
        
        nftItems[_tokenId].isListed = false;
        
        emit NFTUnlisted(_tokenId, msg.sender);
    }
    
    function purchaseNFT(uint256 _tokenId) external payable nonReentrant {
        require(_exists(_tokenId), "NFT does not exist");
        require(nftItems[_tokenId].isListed, "NFT is not listed");
        require(msg.value >= nftItems[_tokenId].price, "Insufficient payment");
        require(ownerOf(_tokenId) != msg.sender, "Cannot buy your own NFT");
        
        address seller = ownerOf(_tokenId);
        uint256 price = nftItems[_tokenId].price;
        uint256 platformFeeAmount = (price * platformFee) / FEE_DENOMINATOR;
        uint256 creatorFeeAmount = (price * 250) / FEE_DENOMINATOR; // 2.5% to creator
        uint256 sellerAmount = price - platformFeeAmount - creatorFeeAmount;
        
        // Transfer NFT
        _transfer(seller, msg.sender, _tokenId);
        
        // Update NFT item
        nftItems[_tokenId].owner = msg.sender;
        nftItems[_tokenId].isListed = false;
        
        // Update owner arrays
        _removeFromOwnerArray(seller, _tokenId);
        nftsByOwner[msg.sender].push(_tokenId);
        
        // Transfer payments
        (bool success1, ) = seller.call{value: sellerAmount}("");
        require(success1, "Payment to seller failed");
        
        (bool success2, ) = nftItems[_tokenId].creator.call{value: creatorFeeAmount}("");
        require(success2, "Payment to creator failed");
        
        // Platform fee goes to contract owner
        (bool success3, ) = owner().call{value: platformFeeAmount}("");
        require(success3, "Payment to platform failed");
        
        emit NFTPurchased(_tokenId, msg.sender, seller, price);
    }
    
    function updateListingFee(uint256 _newFee) external onlyOwner {
        listingFee = _newFee;
    }
    
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Platform fee cannot exceed 10%");
        platformFee = _newFee;
    }
    
    function getNFT(uint256 _tokenId) external view returns (NFTItem memory) {
        require(_exists(_tokenId), "NFT does not exist");
        return nftItems[_tokenId];
    }
    
    function getOwnerNFTs(address _owner) external view returns (uint256[] memory) {
        return nftsByOwner[_owner];
    }
    
    function getTotalNFTs() external view returns (uint256) {
        return _tokenIds.current();
    }
    
    function _removeFromOwnerArray(address _owner, uint256 _tokenId) internal {
        uint256[] storage ownerNFTs = nftsByOwner[_owner];
        for (uint256 i = 0; i < ownerNFTs.length; i++) {
            if (ownerNFTs[i] == _tokenId) {
                ownerNFTs[i] = ownerNFTs[ownerNFTs.length - 1];
                ownerNFTs.pop();
                break;
            }
        }
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
