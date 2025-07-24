// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./GateToken.sol";
import "./RuleEngine.sol";

contract CBDCWallet is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant WALLET_OPERATOR_ROLE = keccak256("WALLET_OPERATOR_ROLE");

    struct WalletInfo {
        address owner;
        mapping(address => uint256) tokenBalances;
        address[] supportedTokens;
        bool isActive;
        uint256 createdAt;
    }

    mapping(address => WalletInfo) public wallets;
    mapping(address => bool) public supportedTokenContracts;
    
    RuleEngine public ruleEngine;
    
    // Events
    event WalletCreated(address indexed owner, uint256 timestamp);
    event TokenAdded(address indexed tokenContract, string symbol);
    event TokenTransferred(address indexed from, address indexed to, address indexed token, uint256 amount);
    event TokenMinted(address indexed to, address indexed token, uint256 amount);
    event TokenBurned(address indexed from, address indexed token, uint256 amount);
    event RuleTriggered(address indexed user, uint256 indexed ruleId, string action);

    constructor(address admin, address _ruleEngine) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WALLET_OPERATOR_ROLE, admin);
        ruleEngine = RuleEngine(_ruleEngine);
    }

    function createWallet() public whenNotPaused {
        require(wallets[msg.sender].owner == address(0), "CBDCWallet: wallet already exists");
        
        WalletInfo storage wallet = wallets[msg.sender];
        wallet.owner = msg.sender;
        wallet.isActive = true;
        wallet.createdAt = block.timestamp;
        
        emit WalletCreated(msg.sender, block.timestamp);
    }

    function addSupportedToken(address tokenContract, string memory symbol) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokenContract != address(0), "CBDCWallet: invalid token contract");
        require(!supportedTokenContracts[tokenContract], "CBDCWallet: token already supported");
        
        supportedTokenContracts[tokenContract] = true;
        emit TokenAdded(tokenContract, symbol);
    }

    function sendToken(
        address to,
        address tokenContract,
        uint256 amount
    ) public whenNotPaused nonReentrant {
        require(wallets[msg.sender].isActive, "CBDCWallet: sender wallet not active");
        require(wallets[to].isActive, "CBDCWallet: recipient wallet not active");
        require(supportedTokenContracts[tokenContract], "CBDCWallet: token not supported");
        require(amount > 0, "CBDCWallet: amount must be greater than 0");

        GateToken token = GateToken(tokenContract);
        require(token.balanceOf(msg.sender) >= amount, "CBDCWallet: insufficient balance");

        // Execute transfer
        bool success = token.transferFrom(msg.sender, to, amount);
        require(success, "CBDCWallet: transfer failed");

        emit TokenTransferred(msg.sender, to, tokenContract, amount);

        // Check and trigger rules after successful transfer
        _triggerRulesIfApplicable(msg.sender);
        _triggerRulesIfApplicable(to);
    }

    function mintToken(
        address to,
        address tokenContract,
        uint256 amount
    ) public onlyRole(WALLET_OPERATOR_ROLE) whenNotPaused nonReentrant {
        require(wallets[to].isActive, "CBDCWallet: recipient wallet not active");
        require(supportedTokenContracts[tokenContract], "CBDCWallet: token not supported");
        require(amount > 0, "CBDCWallet: amount must be greater than 0");

        GateToken token = GateToken(tokenContract);
        token.mint(to, amount);

        emit TokenMinted(to, tokenContract, amount);

        // Check and trigger rules after successful mint
        _triggerRulesIfApplicable(to);
    }

    function burnToken(
        address from,
        address tokenContract,
        uint256 amount
    ) public onlyRole(WALLET_OPERATOR_ROLE) whenNotPaused nonReentrant {
        require(wallets[from].isActive, "CBDCWallet: wallet not active");
        require(supportedTokenContracts[tokenContract], "CBDCWallet: token not supported");
        require(amount > 0, "CBDCWallet: amount must be greater than 0");

        GateToken token = GateToken(tokenContract);
        require(token.balanceOf(from) >= amount, "CBDCWallet: insufficient balance");

        token.burn(from, amount);

        emit TokenBurned(from, tokenContract, amount);

        // Check and trigger rules after successful burn
        _triggerRulesIfApplicable(from);
    }

    function getWalletBalance(address owner, address tokenContract) public view returns (uint256) {
        require(supportedTokenContracts[tokenContract], "CBDCWallet: token not supported");
        
        GateToken token = GateToken(tokenContract);
        return token.balanceOf(owner);
    }

    function isWalletActive(address owner) public view returns (bool) {
        return wallets[owner].isActive;
    }

    function triggerRulesManually(address user) public onlyRole(WALLET_OPERATOR_ROLE) {
        _triggerRulesIfApplicable(user);
    }

    function _triggerRulesIfApplicable(address user) private {
        uint256[] memory eligibleRules = ruleEngine.evaluateRules(user);
        
        for (uint256 i = 0; i < eligibleRules.length; i++) {
            uint256 ruleId = eligibleRules[i];
            RuleEngine.Rule memory rule = ruleEngine.getRule(ruleId);
            
            // For now, we just emit an event - actual rule execution would be implemented
            emit RuleTriggered(user, ruleId, rule.action);
        }
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function grantOperatorRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(WALLET_OPERATOR_ROLE, account);
    }
}