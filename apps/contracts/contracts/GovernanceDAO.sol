// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GovernanceDAO is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _proposalIds;
    
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 votingPower;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool canceled;
        uint256 createdAt;
    }
    
    struct Vote {
        address voter;
        bool support;
        uint256 votingPower;
        uint256 timestamp;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => uint256) public votingPower;
    mapping(address => bool) public isMember;
    
    uint256 public constant MIN_VOTING_POWER = 1000; // Minimum voting power to create proposal
    uint256 public constant VOTING_DURATION = 7 days;
    uint256 public constant EXECUTION_DELAY = 1 days;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votingPower
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event MemberAdded(address indexed member, uint256 votingPower);
    event MemberRemoved(address indexed member);
    event VotingPowerUpdated(address indexed member, uint256 newVotingPower);
    
    modifier onlyMember() {
        require(isMember[msg.sender], "Not a DAO member");
        _;
    }
    
    modifier proposalExists(uint256 _proposalId) {
        require(_proposalId > 0 && _proposalId <= _proposalIds.current(), "Proposal does not exist");
        _;
    }
    
    modifier proposalActive(uint256 _proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal canceled");
        _;
    }
    
    function addMember(address _member, uint256 _votingPower) external onlyOwner {
        require(_member != address(0), "Invalid address");
        require(_votingPower > 0, "Voting power must be greater than 0");
        
        isMember[_member] = true;
        votingPower[_member] = _votingPower;
        
        emit MemberAdded(_member, _votingPower);
    }
    
    function removeMember(address _member) external onlyOwner {
        require(isMember[_member], "Not a member");
        
        isMember[_member] = false;
        votingPower[_member] = 0;
        
        emit MemberRemoved(_member);
    }
    
    function updateVotingPower(address _member, uint256 _newVotingPower) external onlyOwner {
        require(isMember[_member], "Not a member");
        require(_newVotingPower > 0, "Voting power must be greater than 0");
        
        votingPower[_member] = _newVotingPower;
        
        emit VotingPowerUpdated(_member, _newVotingPower);
    }
    
    function createProposal(
        string memory _title,
        string memory _description
    ) external onlyMember returns (uint256) {
        require(votingPower[msg.sender] >= MIN_VOTING_POWER, "Insufficient voting power");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + VOTING_DURATION;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            title: _title,
            description: _description,
            proposer: msg.sender,
            votingPower: votingPower[msg.sender],
            forVotes: 0,
            againstVotes: 0,
            startTime: startTime,
            endTime: endTime,
            executed: false,
            canceled: false,
            createdAt: block.timestamp
        });
        
        emit ProposalCreated(proposalId, msg.sender, _title, startTime, endTime);
        
        return proposalId;
    }
    
    function castVote(uint256 _proposalId, bool _support) external onlyMember proposalExists(_proposalId) proposalActive(_proposalId) {
        require(votes[_proposalId][msg.sender].timestamp == 0, "Already voted");
        
        uint256 voterPower = votingPower[msg.sender];
        require(voterPower > 0, "No voting power");
        
        votes[_proposalId][msg.sender] = Vote({
            voter: msg.sender,
            support: _support,
            votingPower: voterPower,
            timestamp: block.timestamp
        });
        
        if (_support) {
            proposals[_proposalId].forVotes += voterPower;
        } else {
            proposals[_proposalId].againstVotes += voterPower;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, voterPower);
    }
    
    function executeProposal(uint256 _proposalId) external onlyOwner proposalExists(_proposalId) nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(proposal.forVotes > proposal.againstVotes, "Proposal not passed");
        require(block.timestamp >= proposal.endTime + EXECUTION_DELAY, "Execution delay not met");
        
        proposal.executed = true;
        
        emit ProposalExecuted(_proposalId);
    }
    
    function cancelProposal(uint256 _proposalId) external onlyOwner proposalExists(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Already executed");
        require(!proposal.canceled, "Already canceled");
        
        proposal.canceled = true;
        
        emit ProposalCanceled(_proposalId);
    }
    
    function getProposal(uint256 _proposalId) external view proposalExists(_proposalId) returns (Proposal memory) {
        return proposals[_proposalId];
    }
    
    function getVote(uint256 _proposalId, address _voter) external view returns (Vote memory) {
        return votes[_proposalId][_voter];
    }
    
    function getTotalProposals() external view returns (uint256) {
        return _proposalIds.current();
    }
    
    function getProposalState(uint256 _proposalId) external view returns (string memory) {
        Proposal storage proposal = proposals[_proposalId];
        
        if (proposal.canceled) {
            return "Canceled";
        } else if (proposal.executed) {
            return "Executed";
        } else if (block.timestamp < proposal.startTime) {
            return "Pending";
        } else if (block.timestamp <= proposal.endTime) {
            return "Active";
        } else if (proposal.forVotes <= proposal.againstVotes) {
            return "Defeated";
        } else if (block.timestamp < proposal.endTime + EXECUTION_DELAY) {
            return "Succeeded";
        } else {
            return "Executable";
        }
    }
}
