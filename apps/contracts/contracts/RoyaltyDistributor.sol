// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RoyaltyDistributor
 * @dev Handles automated royalty distribution to artists and stakeholders
 * @author HarmonyChain Team
 */
contract RoyaltyDistributor is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _distributionIds;

    struct RevenueSplit {
        address[] recipients;
        uint256[] percentages;
        bool isActive;
    }

    struct Distribution {
        uint256 id;
        uint256 trackId;
        uint256 totalAmount;
        address[] recipients;
        uint256[] amounts;
        uint256 timestamp;
        string description;
    }

    struct PendingDistribution {
        uint256 trackId;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => RevenueSplit) public trackSplits;
    mapping(uint256 => Distribution) public distributions;
    mapping(uint256 => PendingDistribution) public pendingDistributions;
    mapping(address => uint256) public artistBalances;
    mapping(address => uint256) public totalEarned;

    IERC20 public paymentToken;
    address public treasury;
    uint256 public constant MAX_RECIPIENTS = 10;
    uint256 public constant PERCENTAGE_PRECISION = 10000; // 100.00%

    event RevenueSplitSet(
        uint256 indexed trackId,
        address[] recipients,
        uint256[] percentages
    );

    event RoyaltiesDistributed(
        uint256 indexed distributionId,
        uint256 indexed trackId,
        uint256 totalAmount,
        address[] recipients,
        uint256[] amounts
    );

    event PendingDistributionCreated(
        uint256 indexed trackId,
        uint256 amount
    );

    event Withdrawal(
        address indexed recipient,
        uint256 amount
    );

    modifier validSplit(uint256[] memory _percentages) {
        require(_percentages.length <= MAX_RECIPIENTS, "Too many recipients");
        require(_percentages.length > 0, "No recipients specified");
        
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _percentages.length; i++) {
            require(_percentages[i] > 0, "Invalid percentage");
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == PERCENTAGE_PRECISION, "Percentages must sum to 100%");
        _;
    }

    constructor(address _paymentToken, address _treasury) {
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
    }

    /**
     * @dev Set revenue split for a track
     * @param _trackId Track ID
     * @param _recipients Array of recipient addresses
     * @param _percentages Array of percentage shares (in basis points)
     */
    function setRevenueSplit(
        uint256 _trackId,
        address[] memory _recipients,
        uint256[] memory _percentages
    ) external validSplit(_percentages) {
        require(_recipients.length == _percentages.length, "Arrays length mismatch");
        require(_recipients.length > 0, "No recipients specified");

        // Verify all recipients are valid addresses
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Invalid recipient address");
        }

        trackSplits[_trackId] = RevenueSplit({
            recipients: _recipients,
            percentages: _percentages,
            isActive: true
        });

        emit RevenueSplitSet(_trackId, _recipients, _percentages);
    }

    /**
     * @dev Distribute royalties for a track
     * @param _trackId Track ID
     * @param _amount Total amount to distribute
     * @param _description Description of the distribution
     */
    function distributeRoyalties(
        uint256 _trackId,
        uint256 _amount,
        string memory _description
    ) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(trackSplits[_trackId].isActive, "No revenue split set for track");
        require(paymentToken.balanceOf(address(this)) >= _amount, "Insufficient balance");

        RevenueSplit memory split = trackSplits[_trackId];
        uint256[] memory amounts = new uint256[](split.recipients.length);

        // Calculate amounts for each recipient
        for (uint256 i = 0; i < split.recipients.length; i++) {
            amounts[i] = (_amount * split.percentages[i]) / PERCENTAGE_PRECISION;
        }

        // Verify total amounts don't exceed available balance
        uint256 totalDistributed = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalDistributed += amounts[i];
        }
        require(totalDistributed <= _amount, "Distribution exceeds available balance");

        _distributionIds.increment();
        uint256 distributionId = _distributionIds.current();

        distributions[distributionId] = Distribution({
            id: distributionId,
            trackId: _trackId,
            totalAmount: _amount,
            recipients: split.recipients,
            amounts: amounts,
            timestamp: block.timestamp,
            description: _description
        });

        // Transfer tokens to recipients
        for (uint256 i = 0; i < split.recipients.length; i++) {
            if (amounts[i] > 0) {
                require(
                    paymentToken.transfer(split.recipients[i], amounts[i]),
                    "Transfer failed"
                );
                
                // Update tracking
                artistBalances[split.recipients[i]] += amounts[i];
                totalEarned[split.recipients[i]] += amounts[i];
            }
        }

        emit RoyaltiesDistributed(
            distributionId,
            _trackId,
            _amount,
            split.recipients,
            amounts
        );
    }

    /**
     * @dev Create a pending distribution (for manual review)
     * @param _trackId Track ID
     * @param _amount Amount to be distributed
     */
    function createPendingDistribution(
        uint256 _trackId,
        uint256 _amount
    ) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(paymentToken.balanceOf(address(this)) >= _amount, "Insufficient balance");

        pendingDistributions[_trackId] = PendingDistribution({
            trackId: _trackId,
            amount: _amount,
            timestamp: block.timestamp
        });

        emit PendingDistributionCreated(_trackId, _amount);
    }

    /**
     * @dev Execute a pending distribution
     * @param _trackId Track ID
     * @param _description Description of the distribution
     */
    function executePendingDistribution(
        uint256 _trackId,
        string memory _description
    ) external onlyOwner {
        PendingDistribution memory pending = pendingDistributions[_trackId];
        require(pending.amount > 0, "No pending distribution for track");

        // Clear pending distribution
        delete pendingDistributions[_trackId];

        // Execute distribution
        distributeRoyalties(_trackId, pending.amount, _description);
    }

    /**
     * @dev Get revenue split for a track
     * @param _trackId Track ID
     * @return RevenueSplit struct
     */
    function getRevenueSplit(uint256 _trackId) external view returns (RevenueSplit memory) {
        return trackSplits[_trackId];
    }

    /**
     * @dev Get distribution information
     * @param _distributionId Distribution ID
     * @return Distribution struct
     */
    function getDistribution(uint256 _distributionId) external view returns (Distribution memory) {
        require(distributions[_distributionId].id != 0, "Distribution not found");
        return distributions[_distributionId];
    }

    /**
     * @dev Get artist's total earnings
     * @param _artist Artist address
     * @return Total earnings
     */
    function getArtistEarnings(address _artist) external view returns (uint256) {
        return totalEarned[_artist];
    }

    /**
     * @dev Get artist's current balance
     * @param _artist Artist address
     * @return Current balance
     */
    function getArtistBalance(address _artist) external view returns (uint256) {
        return artistBalances[_artist];
    }

    /**
     * @dev Withdraw artist's balance
     * @param _amount Amount to withdraw
     */
    function withdraw(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(artistBalances[msg.sender] >= _amount, "Insufficient balance");

        artistBalances[msg.sender] -= _amount;

        require(
            paymentToken.transfer(msg.sender, _amount),
            "Transfer failed"
        );

        emit Withdrawal(msg.sender, _amount);
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
     * @dev Emergency withdrawal (only owner)
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(paymentToken.balanceOf(address(this)) >= _amount, "Insufficient balance");

        require(
            paymentToken.transfer(owner(), _amount),
            "Transfer failed"
        );
    }

    /**
     * @dev Get total number of distributions
     * @return Total distribution count
     */
    function getTotalDistributions() external view returns (uint256) {
        return _distributionIds.current();
    }

    /**
     * @dev Check if track has pending distribution
     * @param _trackId Track ID
     * @return True if pending distribution exists
     */
    function hasPendingDistribution(uint256 _trackId) external view returns (bool) {
        return pendingDistributions[_trackId].amount > 0;
    }
}
