// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721Enumerable, Ownable {
    // ตัวนับลำดับ Token ID เริ่มต้นที่ 1
    uint256 private _nextTokenId = 1;
    
    // Mapping สำหรับเก็บความสัมพันธ์: Serial Number -> Token ID
    mapping(string => uint256) public serialToTokenId;
    
    // Mapping สำหรับเก็บความสัมพันธ์: Token ID -> Serial Number
    mapping(uint256 => string) public tokenIdToSerial;

    // Event สำหรับให้ Backend ดักฟัง
    event Minted(uint256 indexed tokenId, address to, string serial);
    event Registered(uint256 indexed tokenId, address indexed from, address indexed to, string serial);

    constructor() ERC721("LuxeChain Asset", "LUXE") {}

    /**
     * @dev [หน้า Add Product] - Admin เสกของเข้าสต็อกตัวเอง
     * @param to: ที่อยู่กระเป๋า Admin (ผู้ถือครองคนแรก)
     * @param serial: เลข Serial จากสินค้าจริง
     */
    function mint(address to, string memory serial) external onlyOwner returns (uint256) {
        require(serialToTokenId[serial] == 0, "Serial already registered");
        
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId); 
        
        serialToTokenId[serial] = tokenId;
        tokenIdToSerial[tokenId] = serial;
        
        emit Minted(tokenId, to, serial);
        _nextTokenId++; 
        return tokenId;
    }

    /**
     * @dev [หน้า Register] - เปลี่ยนชื่อเจ้าของจาก Admin ไปเป็น User (ตาม Email)
     * @param to: Wallet Address ของ User (ที่ Backend แปลงมาจาก Email)
     * @param serial: เลข Serial ของสินค้าที่ Admin เคย Mint ไว้แล้ว
     */
    function regis(address to, string memory serial) public onlyOwner {
        // 1. ดึง Token ID จาก Serial ที่มีอยู่ในระบบ
        uint256 tokenId = serialToTokenId[serial];
        require(tokenId != 0, "Product not found. Please add product first.");
        
        // 2. ตรวจสอบว่าปัจจุบัน Admin ยังเป็นเจ้าของอยู่ (เพื่อทำการโอน)
        address adminOwner = ownerOf(tokenId);
        require(adminOwner == owner(), "Product already registered to someone else");
        require(to != address(0), "Invalid receiver address");

        // 3. ทำการโอนสิทธิ์จาก Admin ไปให้ User
        _safeTransfer(adminOwner, to, tokenId, "");

        emit Registered(tokenId, adminOwner, to, serial);
    }

    /**
     * @dev [หน้า Verify] - ตรวจสอบเจ้าของปัจจุบัน
     */
    function getOwnerBySerial(string memory serial) external view returns (address) {
        uint256 tokenId = serialToTokenId[serial];
        require(tokenId != 0, "Product not found on Blockchain");
        return ownerOf(tokenId); 
    }
}