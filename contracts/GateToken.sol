// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GateToken is ERC20, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Token symbol mapping
    string private _tokenSymbol;
    uint8 private _decimals;

    // Events
    event TokenMinted(address indexed to, uint256 amount, address indexed minter);
    event TokenBurned(address indexed from, uint256 amount, address indexed burner);
    event TransferExecuted(address indexed from, address indexed to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint8 tokenDecimals,
        address admin
    ) ERC20(name, symbol) {
        _tokenSymbol = symbol;
        _decimals = tokenDecimals;
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(BURNER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused nonReentrant {
        require(to != address(0), "GateToken: mint to the zero address");
        require(amount > 0, "GateToken: amount must be greater than 0");
        
        _mint(to, amount);
        emit TokenMinted(to, amount, msg.sender);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) whenNotPaused nonReentrant {
        require(from != address(0), "GateToken: burn from the zero address");
        require(amount > 0, "GateToken: amount must be greater than 0");
        require(balanceOf(from) >= amount, "GateToken: burn amount exceeds balance");
        
        _burn(from, amount);
        emit TokenBurned(from, amount, msg.sender);
    }

    function transfer(address to, uint256 amount) public override whenNotPaused nonReentrant returns (bool) {
        require(to != address(0), "GateToken: transfer to the zero address");
        require(amount > 0, "GateToken: amount must be greater than 0");
        
        bool success = super.transfer(to, amount);
        if (success) {
            emit TransferExecuted(msg.sender, to, amount);
        }
        return success;
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused nonReentrant returns (bool) {
        require(from != address(0), "GateToken: transfer from the zero address");
        require(to != address(0), "GateToken: transfer to the zero address");
        require(amount > 0, "GateToken: amount must be greater than 0");
        
        bool success = super.transferFrom(from, to, amount);
        if (success) {
            emit TransferExecuted(from, to, amount);
        }
        return success;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function grantMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }

    function grantBurnerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(BURNER_ROLE, account);
    }

    function revokeMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }

    function revokeBurnerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(BURNER_ROLE, account);
    }
}