// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721Enumerable, Ownable {
    // ตัวนับลำดับ Token ID เริ่มต้นที่ 1
    uint256 private _nextTokenId = 1;
    
    // Mapping สำหรับเก็บความสัมพันธ์: Serial Number (String) -> Token ID (Uint)
    mapping(string => uint256) public serialToTokenId;
    
    // Mapping สำหรับเก็บความสัมพันธ์: Token ID (Uint) -> Serial Number (String)
    mapping(uint256 => string) public tokenIdToSerial;

    // Event แจ้งเตือนเมื่อมีการ Mint (ให้ Back-end จับไปลง Database ได้)
    event Minted(uint256 indexed tokenId, address to, string serial);

    constructor() ERC721("LuxeChain Asset", "LUXE") {}

    /**
     * @dev [สำหรับหน้า Admin]
     * @param to: ที่อยู่กระเป๋าเจ้าของคนแรก
     * @param serial: เลข Serial จากสินค้าจริง
     * ฟังก์ชันนี้จะ "เสก" NFT และผูก Serial เข้ากับ ID ทันที
     */
    function mint(address to, string memory serial) external onlyOwner returns (uint256) {
        // เช็คว่า Serial นี้เคย Mint ไปหรือยัง (ห้ามซ้ำ)
        require(serialToTokenId[serial] == 0, "Serial already registered");
        
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId); // สร้าง NFT ให้กับที่อยู่ที่ระบุ
        
        // บันทึกข้อมูลลง Blockchain
        serialToTokenId[serial] = tokenId;
        tokenIdToSerial[tokenId] = serial;
        
        emit Minted(tokenId, to, serial);
        _nextTokenId++; // เพิ่มลำดับ ID สำหรับชิ้นต่อไป
        return tokenId;
    }

    /**
     * @dev [สำหรับหน้า Verify]
     * @param serial: เลข Serial ที่ User กรอกในหน้าเว็บ
     * คืนค่า: Address ของเจ้าของปัจจุบัน (ถ้าคืนค่า 0x0... แสดงว่าของปลอม)
     */
    function getOwnerBySerial(string memory serial) external view returns (address) {
        uint256 tokenId = serialToTokenId[serial];
        require(tokenId != 0, "Product not found on Blockchain");
        return ownerOf(tokenId); // ดึงข้อมูลเจ้าของปัจจุบันจากมาตรฐาน ERC721
    }
}