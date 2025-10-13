// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GovernanceDAO
 * @dev Decentralized governance for HarmonyChain platform
 * @author HarmonyChain Team
 */
contract GovernanceDAO is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _proposalIds;

    enum ProposalType {
        PLATFORM_UPGRADE,
        ECONOMIC_CHANGE,
        FEATURE_REQUEST,
        TREASURY_ALLOCATION,
        PARAMETER_CHANGE
    }

    enum ProposalStatus {
        PENDING,
        ACTIVE,
        EXECUTED,
        REJECTED,
        EXPIRED
    }

    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        uint256 executionDelay;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votingPower;
    }

    struct Vote {
        address voter;
        bool support;
        uint256 weight;
        uint256 timestamp;
        string reason;
    }

    IERC20 public governanceToken;
    uint256 public proposalThreshold = 1000 * 10**18; // Minimum tokens to create proposal
    uint256 public votingPeriod = 7 days;
    uint256 public executionDelay = 1 days;
    uint256 public quorumThreshold = 10000 * 10**18; // Minimum votes for proposal to pass

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Vote[]) public proposalVotes;
    mapping(address => uint256) public userProposals;
    mapping(address => bool) public isDelegate;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title
    );

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );

    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed executor
    );

    event ProposalRejected(
        uint256 indexed proposalId,
        string reason
    );

    event DelegateAdded(
        address indexed delegate
    );

    event DelegateRemoved(
        address indexed delegate
    );

    modifier onlyProposer(uint256 _proposalId) {
        require(proposals[_proposalId].proposer == msg.sender, "Not the proposer");
        _;
    }

    modifier validProposal(uint256 _proposalId) {
        require(proposals[_proposalId].id != 0, "Proposal does not exist");
        _;
    }

    modifier onlyDelegate() {
        require(isDelegate[msg.sender] || msg.sender == owner(), "Not authorized delegate");
        _;
    }

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    /**
     * @dev Create a new governance proposal
     * @param _proposalType Type of proposal
     * @param _title Proposal title
     * @param _description Detailed description
     */
    function createProposal(
        ProposalType _proposalType,
        string memory _title,
        string memory _description
    ) external nonReentrant returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient voting power to create proposal"
        );

        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.proposalType = _proposalType;
        proposal.title = _title;
        proposal.description = _description;
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        proposal.executionDelay = block.timestamp + votingPeriod + executionDelay;
        proposal.status = ProposalStatus.ACTIVE;

        userProposals[msg.sender]++;

        emit ProposalCreated(proposalId, msg.sender, _proposalType, _title);

        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param _proposalId Proposal ID
     * @param _support True for support, false for opposition
     * @param _reason Reason for the vote
     */
    function castVote(
        uint256 _proposalId,
        bool _support,
        string memory _reason
    ) external validProposal(_proposalId) nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 votingPower = governanceToken.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        proposal.votingPower[msg.sender] = votingPower;

        if (_support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }

        proposalVotes[_proposalId].push(Vote({
            voter: msg.sender,
            support: _support,
            weight: votingPower,
            timestamp: block.timestamp,
            reason: _reason
        }));

        emit VoteCast(_proposalId, msg.sender, _support, votingPower);
    }

    /**
     * @dev Execute a proposal after voting period and delay
     * @param _proposalId Proposal ID
     */
    function executeProposal(uint256 _proposalId) external validProposal(_proposalId) nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp >= proposal.executionDelay, "Execution delay not met");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal not passed");
        require(proposal.votesFor >= quorumThreshold, "Quorum not met");

        proposal.status = ProposalStatus.EXECUTED;

        emit ProposalExecuted(_proposalId, msg.sender);
    }

    /**
     * @dev Reject a proposal (only by delegates or owner)
     * @param _proposalId Proposal ID
     * @param _reason Reason for rejection
     */
    function rejectProposal(
        uint256 _proposalId,
        string memory _reason
    ) external validProposal(_proposalId) onlyDelegate {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");

        proposal.status = ProposalStatus.REJECTED;

        emit ProposalRejected(_proposalId, _reason);
    }

    /**
     * @dev Get proposal information
     * @param _proposalId Proposal ID
     * @return Proposal details
     */
    function getProposal(uint256 _proposalId) external view validProposal(_proposalId) returns (
        uint256 id,
        address proposer,
        ProposalType proposalType,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        ProposalStatus status
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.proposalType,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.status
        );
    }

    /**
     * @dev Get votes for a proposal
     * @param _proposalId Proposal ID
     * @return Array of votes
     */
    function getProposalVotes(uint256 _proposalId) external view validProposal(_proposalId) returns (Vote[] memory) {
        return proposalVotes[_proposalId];
    }

    /**
     * @dev Check if user has voted on a proposal
     * @param _proposalId Proposal ID
     * @param _voter Voter address
     * @return True if user has voted
     */
    function hasVoted(uint256 _proposalId, address _voter) external view validProposal(_proposalId) returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }

    /**
     * @dev Get user's voting power for a proposal
     * @param _proposalId Proposal ID
     * @param _voter Voter address
     * @return Voting power
     */
    function getVotingPower(uint256 _proposalId, address _voter) external view validProposal(_proposalId) returns (uint256) {
        return proposals[_proposalId].votingPower[_voter];
    }

    /**
     * @dev Add a delegate (only owner)
     * @param _delegate Delegate address
     */
    function addDelegate(address _delegate) external onlyOwner {
        require(_delegate != address(0), "Invalid delegate address");
        require(!isDelegate[_delegate], "Already a delegate");
        
        isDelegate[_delegate] = true;
        emit DelegateAdded(_delegate);
    }

    /**
     * @dev Remove a delegate (only owner)
     * @param _delegate Delegate address
     */
    function removeDelegate(address _delegate) external onlyOwner {
        require(isDelegate[_delegate], "Not a delegate");
        
        isDelegate[_delegate] = false;
        emit DelegateRemoved(_delegate);
    }

    /**
     * @dev Update proposal threshold (only owner)
     * @param _newThreshold New threshold
     */
    function updateProposalThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold > 0, "Invalid threshold");
        proposalThreshold = _newThreshold;
    }

    /**
     * @dev Update quorum threshold (only owner)
     * @param _newThreshold New quorum threshold
     */
    function updateQuorumThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold > 0, "Invalid quorum threshold");
        quorumThreshold = _newThreshold;
    }

    /**
     * @dev Update voting period (only owner)
     * @param _newPeriod New voting period in seconds
     */
    function updateVotingPeriod(uint256 _newPeriod) external onlyOwner {
        require(_newPeriod > 0, "Invalid voting period");
        votingPeriod = _newPeriod;
    }

    /**
     * @dev Get total number of proposals
     * @return Total proposal count
     */
    function getTotalProposals() external view returns (uint256) {
        return _proposalIds.current();
    }

    /**
     * @dev Get user's proposal count
     * @param _user User address
     * @return Number of proposals created
     */
    function getUserProposalCount(address _user) external view returns (uint256) {
        return userProposals[_user];
    }
}
