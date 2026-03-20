// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721Enumerable, Ownable {
    // ตัวนับลำดับ Token ID เริ่มต้นที่ 1
    uint256 private _nextTokenId = 1;
    
    // Mapping: Serial Number -> Token ID
    mapping(string => uint256) public serialToTokenId;
    
    // Mapping: Token ID -> Serial Number (เผื่อใช้ตรวจสอบย้อนกลับ)
    mapping(uint256 => string) public tokenIdToSerial;

    // Event แจ้งเตือนเมื่อมีการลงทะเบียน (ให้ Backend จับไปลง SQL ได้)
    event Registered(uint256 indexed tokenId, address indexed owner, string serial);

    constructor() ERC721("LuxeChain Asset", "LUXE") {}

    /**
     * @dev [หน้า Admin Register]
     * @param to: Wallet Address ของเจ้าของ (Backend ต้องแปลงจาก Email มาเป็น Address ก่อนส่ง)
     * @param serial: เลข Serial จากสินค้าจริง
     */
    function regis(address to, string memory serial) external onlyOwner returns (uint256) {
        // 1. เช็คว่า Serial นี้เคยลงทะเบียนไปหรือยัง (ห้ามซ้ำ)
        require(serialToTokenId[serial] == 0, "Serial already registered");
        
        uint256 tokenId = _nextTokenId;
        
        // 2. สร้าง NFT และส่งเข้า Wallet ของเจ้าของ (ห้ามส่ง Email เข้ามาในนี้)
        _safeMint(to, tokenId);
        
        // 3. บันทึกความสัมพันธ์ลง Blockchain
        serialToTokenId[serial] = tokenId;
        tokenIdToSerial[tokenId] = serial;
        
        // 4. พ่น Event ออกไปเพื่อให้ Backend รู้
        emit Registered(tokenId, to, serial);
        
        _nextTokenId++; // ขยับลำดับไปชิ้นถัดไป
        return tokenId;
    }

    /**
     * @dev [สำหรับหน้า Verify]
     * @param serial: เลข Serial ที่กรอกในหน้าเว็บ
     * คืนค่า: Wallet Address ของเจ้าของปัจจุบัน
     */
    function getOwnerBySerial(string memory serial) external view returns (address) {
        uint256 tokenId = serialToTokenId[serial];
        require(tokenId != 0, "Product not found on Blockchain");
        
        // คืนค่าที่อยู่กระเป๋าคนที่เป็นเจ้าของ NFT ชิ้นนี้ ณ ปัจจุบัน
        return ownerOf(tokenId); 
    }
}