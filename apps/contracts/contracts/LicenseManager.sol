// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title LicenseManager
 * @dev Manages music licensing and permissions
 * @author HarmonyChain Team
 */
contract LicenseManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _licenseIds;

    enum LicenseType {
        PERSONAL_USE,
        COMMERCIAL_USE,
        DERIVATIVE_WORK,
        SAMPLING
    }

    struct LicenseTerms {
        bool allowPersonalUse;
        bool allowCommercialUse;
        bool allowDerivatives;
        bool allowSampling;
        uint256 commercialFee; // in wei
        uint256 derivativeFee; // in wei
        uint256 samplingFee; // in wei
        uint256 validityPeriod; // in seconds
    }

    struct License {
        uint256 id;
        uint256 trackId;
        address licensee;
        LicenseType licenseType;
        uint256 fee;
        uint256 issuedAt;
        uint256 expiresAt;
        bool isActive;
        string purpose;
    }

    mapping(uint256 => LicenseTerms) public trackLicenses;
    mapping(uint256 => License) public licenses;
    mapping(address => uint256[]) public userLicenses;
    mapping(uint256 => mapping(address => bool)) public hasLicense;

    IERC20 public paymentToken; // USDC or other ERC20 token
    address public treasury;

    event LicenseTermsSet(
        uint256 indexed trackId,
        address indexed artist,
        bool allowCommercial,
        bool allowDerivatives,
        bool allowSampling
    );

    event LicenseIssued(
        uint256 indexed licenseId,
        uint256 indexed trackId,
        address indexed licensee,
        LicenseType licenseType,
        uint256 fee
    );

    event LicenseRevoked(
        uint256 indexed licenseId,
        address indexed licensee
    );

    modifier onlyTrackOwner(uint256 _trackId) {
        // This would need to be integrated with MusicRegistry
        // For now, we'll use a simple mapping
        require(trackOwners[_trackId] == msg.sender, "Not track owner");
        _;
    }

    modifier validLicenseType(LicenseType _licenseType) {
        require(uint256(_licenseType) <= 3, "Invalid license type");
        _;
    }

    // Temporary mapping for track owners - should be replaced with MusicRegistry integration
    mapping(uint256 => address) public trackOwners;

    constructor(address _paymentToken, address _treasury) {
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
    }

    /**
     * @dev Set license terms for a track
     * @param _trackId Track ID
     * @param _terms License terms
     */
    function setLicenseTerms(
        uint256 _trackId,
        LicenseTerms memory _terms
    ) external onlyTrackOwner(_trackId) {
        require(_terms.commercialFee >= 0, "Invalid commercial fee");
        require(_terms.derivativeFee >= 0, "Invalid derivative fee");
        require(_terms.samplingFee >= 0, "Invalid sampling fee");

        trackLicenses[_trackId] = _terms;

        emit LicenseTermsSet(
            _trackId,
            msg.sender,
            _terms.allowCommercialUse,
            _terms.allowDerivatives,
            _terms.allowSampling
        );
    }

    /**
     * @dev Request a license for a track
     * @param _trackId Track ID
     * @param _licenseType Type of license requested
     * @param _purpose Purpose of the license
     */
    function requestLicense(
        uint256 _trackId,
        LicenseType _licenseType,
        string memory _purpose
    ) external payable nonReentrant validLicenseType(_licenseType) returns (uint256) {
        LicenseTerms memory terms = trackLicenses[_trackId];
        require(terms.allowPersonalUse || terms.allowCommercialUse, "No licenses available");

        uint256 requiredFee = 0;
        bool isAllowed = false;

        if (_licenseType == LicenseType.PERSONAL_USE) {
            isAllowed = terms.allowPersonalUse;
            requiredFee = 0; // Personal use is free
        } else if (_licenseType == LicenseType.COMMERCIAL_USE) {
            isAllowed = terms.allowCommercialUse;
            requiredFee = terms.commercialFee;
        } else if (_licenseType == LicenseType.DERIVATIVE_WORK) {
            isAllowed = terms.allowDerivatives;
            requiredFee = terms.derivativeFee;
        } else if (_licenseType == LicenseType.SAMPLING) {
            isAllowed = terms.allowSampling;
            requiredFee = terms.samplingFee;
        }

        require(isAllowed, "License type not allowed");
        require(msg.value >= requiredFee, "Insufficient payment");

        _licenseIds.increment();
        uint256 licenseId = _licenseIds.current();

        licenses[licenseId] = License({
            id: licenseId,
            trackId: _trackId,
            licensee: msg.sender,
            licenseType: _licenseType,
            fee: requiredFee,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + terms.validityPeriod,
            isActive: true,
            purpose: _purpose
        });

        userLicenses[msg.sender].push(licenseId);
        hasLicense[_trackId][msg.sender] = true;

        // Transfer payment to treasury
        if (requiredFee > 0) {
            payable(treasury).transfer(requiredFee);
        }

        emit LicenseIssued(licenseId, _trackId, msg.sender, _licenseType, requiredFee);

        return licenseId;
    }

    /**
     * @dev Check if user has valid license for a track
     * @param _trackId Track ID
     * @param _user User address
     * @param _licenseType Type of license to check
     * @return True if user has valid license
     */
    function hasValidLicense(
        uint256 _trackId,
        address _user,
        LicenseType _licenseType
    ) external view returns (bool) {
        if (!hasLicense[_trackId][_user]) {
            return false;
        }

        // Check user's licenses for this track
        uint256[] memory userLicenseIds = userLicenses[_user];
        for (uint256 i = 0; i < userLicenseIds.length; i++) {
            License memory license = licenses[userLicenseIds[i]];
            if (license.trackId == _trackId && 
                license.licenseType == _licenseType && 
                license.isActive && 
                license.expiresAt > block.timestamp) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Get license information
     * @param _licenseId License ID
     * @return License struct
     */
    function getLicense(uint256 _licenseId) external view returns (License memory) {
        require(licenses[_licenseId].licensee != address(0), "License not found");
        return licenses[_licenseId];
    }

    /**
     * @dev Get user's licenses
     * @param _user User address
     * @return Array of license IDs
     */
    function getUserLicenses(address _user) external view returns (uint256[] memory) {
        return userLicenses[_user];
    }

    /**
     * @dev Revoke a license (only by track owner)
     * @param _licenseId License ID
     */
    function revokeLicense(uint256 _licenseId) external {
        License storage license = licenses[_licenseId];
        require(license.licensee != address(0), "License not found");
        require(trackOwners[license.trackId] == msg.sender, "Not track owner");

        license.isActive = false;
        hasLicense[license.trackId][license.licensee] = false;

        emit LicenseRevoked(_licenseId, license.licensee);
    }

    /**
     * @dev Set track owner (for testing - should be integrated with MusicRegistry)
     * @param _trackId Track ID
     * @param _owner Owner address
     */
    function setTrackOwner(uint256 _trackId, address _owner) external onlyOwner {
        trackOwners[_trackId] = _owner;
    }

    /**
     * @dev Update treasury address
     * @param _newTreasury New treasury address
     */
    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasury = _newTreasury;
    }

    /**
     * @dev Get license terms for a track
     * @param _trackId Track ID
     * @return LicenseTerms struct
     */
    function getLicenseTerms(uint256 _trackId) external view returns (LicenseTerms memory) {
        return trackLicenses[_trackId];
    }

    /**
     * @dev Get total number of licenses issued
     * @return Total license count
     */
    function getTotalLicenses() external view returns (uint256) {
        return _licenseIds.current();
    }
}
