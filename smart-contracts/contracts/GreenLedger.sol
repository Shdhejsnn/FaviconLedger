// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenLedger is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    enum CompanyType { Agriculture, Manufacturing, Technology, Energy }

    struct Company {
        string name;
        address wallet;
        CompanyType companyType;
        uint256 threshold;
        bool registered;
    }

    struct CarbonCredit {
        string region;
        uint256 amount;
    }

    struct CarbonCredit {
        string region;
        uint256 amount;
    }

    mapping(address => Company) public companies;
    mapping(uint256 => CarbonCredit) public credits;
    mapping(uint256 => CarbonCredit) public credits;

    constructor() ERC721("GreenCredit", "GCC") Ownable(msg.sender) {
        tokenCounter = 0;
    }
        tokenCounter = 0;
    }

    function registerCompany(string memory _name, CompanyType _type) public {
        require(!companies[msg.sender].registered, "Already registered");

        uint256 threshold = 100;
        uint256 threshold = 100;
        if (_type == CompanyType.Manufacturing) threshold = 200;
        else if (_type == CompanyType.Technology) threshold = 80;
        else if (_type == CompanyType.Energy) threshold = 300;

        companies[msg.sender] = Company(_name, msg.sender, _type, threshold, true);
    }

    function getCompany(address _addr) public view returns (
        string memory, address, CompanyType, uint256, bool
    ) {
        Company memory c = companies[_addr];
        return (c.name, c.wallet, c.companyType, c.threshold, c.registered);
    }

    function mintCredit(
        address to,
        string memory region,
        uint256 amount,
        string memory tokenURI
    ) public onlyOwner {
    function mintCredit(
        address to,
        string memory region,
        uint256 amount,
        string memory tokenURI
    ) public onlyOwner {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        credits[tokenId] = CarbonCredit(region, amount);
        credits[tokenId] = CarbonCredit(region, amount);
        tokenCounter++;
    }

    // ✅ Smart contract-based buy logic with ETH forwarding
    function buyCredit(
    string memory region,
    uint256 amount,
    string memory tokenURI
) public payable returns (uint256) {
    require(msg.value > 0, "ETH required");

    uint256 tokenId = tokenCounter;
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
    credits[tokenId] = CarbonCredit(region, amount);
    tokenCounter++;

    payable(owner()).transfer(msg.value);

    return tokenId; // ✅ Return the tokenId
}

    // ✅ New: Sell Credit Back to Owner
    function sellCredit(uint256 tokenId, uint256 salePrice) public {
    // ✅ Smart contract-based buy logic with ETH forwarding
    function buyCredit(
    string memory region,
    uint256 amount,
    string memory tokenURI
) public payable returns (uint256) {
    require(msg.value > 0, "ETH required");

    uint256 tokenId = tokenCounter;
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
    credits[tokenId] = CarbonCredit(region, amount);
    tokenCounter++;

    payable(owner()).transfer(msg.value);

    return tokenId; // ✅ Return the tokenId
}

    // ✅ New: Sell Credit Back to Owner
    function sellCredit(uint256 tokenId, uint256 salePrice) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(address(this).balance >= salePrice, "Insufficient contract balance");

        // Transfer token to owner
        _transfer(msg.sender, owner(), tokenId);
        // Transfer token to owner
        _transfer(msg.sender, owner(), tokenId);

        // Transfer ETH to seller
        payable(msg.sender).transfer(salePrice);
    }

    // View credit metadata
    function getCreditDetails(uint256 tokenId) public view returns (string memory, uint256) {
        CarbonCredit memory c = credits[tokenId];
        return (c.region, c.amount);
    }

    // Owner can deposit ETH into contract to fund future credit purchases
    receive() external payable {}
}
        // Transfer ETH to seller
        payable(msg.sender).transfer(salePrice);
    }

    // View credit metadata
    function getCreditDetails(uint256 tokenId) public view returns (string memory, uint256) {
        CarbonCredit memory c = credits[tokenId];
        return (c.region, c.amount);
    }

    // Owner can deposit ETH into contract to fund future credit purchases
    receive() external payable {}
}