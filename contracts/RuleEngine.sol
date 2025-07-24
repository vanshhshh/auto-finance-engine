// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./GateToken.sol";

contract RuleEngine is AccessControl, ReentrancyGuard {
    bytes32 public constant RULE_EXECUTOR_ROLE = keccak256("RULE_EXECUTOR_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct Rule {
        uint256 id;
        address owner;
        string ruleType; // "fx_rate", "time_based", "weather", "location"
        string conditions; // JSON string with rule conditions
        string action; // "transfer", "mint", "burn", "split_pay"
        string actionConfig; // JSON string with action configuration
        bool isActive;
        uint256 createdAt;
        uint256 lastExecuted;
    }

    struct OracleData {
        string dataType; // "fx_rate", "weather", "location"
        string value; // JSON string with oracle data
        uint256 timestamp;
        address oracle;
    }

    mapping(uint256 => Rule) public rules;
    mapping(address => uint256[]) public userRules;
    mapping(string => OracleData) public oracleData;
    
    uint256 public nextRuleId;
    
    // Events
    event RuleCreated(uint256 indexed ruleId, address indexed owner, string ruleType);
    event RuleExecuted(uint256 indexed ruleId, address indexed owner, bool success, string reason);
    event RuleDeactivated(uint256 indexed ruleId, address indexed owner);
    event OracleDataUpdated(string indexed dataType, string value, address indexed oracle);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RULE_EXECUTOR_ROLE, admin);
        _grantRole(ORACLE_ROLE, admin);
        nextRuleId = 1;
    }

    function createRule(
        string memory ruleType,
        string memory conditions,
        string memory action,
        string memory actionConfig
    ) public nonReentrant returns (uint256) {
        require(bytes(ruleType).length > 0, "RuleEngine: rule type cannot be empty");
        require(bytes(conditions).length > 0, "RuleEngine: conditions cannot be empty");
        require(bytes(action).length > 0, "RuleEngine: action cannot be empty");

        uint256 ruleId = nextRuleId++;
        
        Rule storage newRule = rules[ruleId];
        newRule.id = ruleId;
        newRule.owner = msg.sender;
        newRule.ruleType = ruleType;
        newRule.conditions = conditions;
        newRule.action = action;
        newRule.actionConfig = actionConfig;
        newRule.isActive = true;
        newRule.createdAt = block.timestamp;
        newRule.lastExecuted = 0;

        userRules[msg.sender].push(ruleId);

        emit RuleCreated(ruleId, msg.sender, ruleType);
        return ruleId;
    }

    function getUserRules(address user) public view returns (uint256[] memory) {
        return userRules[user];
    }

    function getRule(uint256 ruleId) public view returns (Rule memory) {
        require(rules[ruleId].id != 0, "RuleEngine: rule does not exist");
        return rules[ruleId];
    }

    function deactivateRule(uint256 ruleId) public {
        require(rules[ruleId].id != 0, "RuleEngine: rule does not exist");
        require(rules[ruleId].owner == msg.sender, "RuleEngine: not rule owner");
        
        rules[ruleId].isActive = false;
        emit RuleDeactivated(ruleId, msg.sender);
    }

    function updateOracleData(
        string memory dataType,
        string memory value
    ) public onlyRole(ORACLE_ROLE) {
        oracleData[dataType] = OracleData({
            dataType: dataType,
            value: value,
            timestamp: block.timestamp,
            oracle: msg.sender
        });

        emit OracleDataUpdated(dataType, value, msg.sender);
    }

    function getOracleData(string memory dataType) public view returns (OracleData memory) {
        return oracleData[dataType];
    }

    function executeRule(
        uint256 ruleId,
        address tokenContract,
        string memory reason
    ) public onlyRole(RULE_EXECUTOR_ROLE) nonReentrant {
        require(rules[ruleId].id != 0, "RuleEngine: rule does not exist");
        require(rules[ruleId].isActive, "RuleEngine: rule is not active");

        Rule storage rule = rules[ruleId];
        
        // Update last executed timestamp
        rule.lastExecuted = block.timestamp;

        // For now, we emit the event - actual execution logic would be implemented
        // based on the specific action type and would interact with the token contract
        emit RuleExecuted(ruleId, rule.owner, true, reason);
    }

    function evaluateRules(address user) public view returns (uint256[] memory eligibleRules) {
        uint256[] memory userRuleIds = userRules[user];
        uint256 eligibleCount = 0;
        
        // Count eligible rules
        for (uint256 i = 0; i < userRuleIds.length; i++) {
            Rule memory rule = rules[userRuleIds[i]];
            if (rule.isActive && _isRuleEligible(rule)) {
                eligibleCount++;
            }
        }
        
        // Create array of eligible rule IDs
        eligibleRules = new uint256[](eligibleCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userRuleIds.length; i++) {
            Rule memory rule = rules[userRuleIds[i]];
            if (rule.isActive && _isRuleEligible(rule)) {
                eligibleRules[index] = rule.id;
                index++;
            }
        }
        
        return eligibleRules;
    }

    function _isRuleEligible(Rule memory rule) private view returns (bool) {
        // Basic time-based check - rule can't execute more than once per hour
        if (rule.lastExecuted > 0 && block.timestamp - rule.lastExecuted < 3600) {
            return false;
        }
        
        // Additional rule evaluation logic would go here
        // For now, we return true for active rules that haven't executed recently
        return true;
    }

    function grantOracleRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ORACLE_ROLE, account);
    }

    function grantExecutorRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(RULE_EXECUTOR_ROLE, account);
    }
}