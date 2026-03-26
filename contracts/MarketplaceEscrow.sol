// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ProductNFT.sol";

contract MarketplaceEscrow is ReentrancyGuard {
    // โครงสร้างข้อมูลสำหรับรายการประกาศขาย
    struct Listing {
        address seller;    // ที่อยู่คนขาย
        address buyer;     // ที่อยู่คนซื้อ (จะเป็น 0x0 จนกว่าจะมีคนมากด Buy)
        uint256 price;     // ราคาที่ตั้งขาย (หน่วยเป็น Wei)
        bool confirmed;    // สถานะการยืนยันรับของ (Step 3)
        bool active;       // สถานะรายการ (True = กำลังขาย, False = จบงานแล้ว)
    }

    ProductNFT public nftContract;
    mapping(uint256 => Listing) public listings;

    constructor(address _nftAddress) {
        nftContract = IERC721(_nftAddress);
    }

    /**
     * @dev [Step 1: Listing] สำหรับหน้า My Collection 
     * @notice ต้องเรียก approve ในหน้าบ้านก่อนสั่งรันฟังก์ชันนี้
     */
    function listProduct(uint256 tokenId, uint256 price) external {
        // ดึง NFT จากกระเป๋าคนขายมาเก็บไว้ที่สัญญานี้ (Lock Asset)
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        
        // สร้างรายการขายใหม่
        listings[tokenId] = Listing(msg.sender, address(0), price, false, true); [cite: 25]
    }

    /**
     * @dev [Step 2: Payment] สำหรับหน้า Market (ปุ่ม Buy Now)
     * เงินที่ส่งมาจะถูกกักไว้ใน Contract ทันที
     */
    function buy(uint256 tokenId) external payable nonReentrant {
        Listing storage list = listings[tokenId];
        require(list.active, "Not for sale");
        require(msg.value == list.price, "Please send exact amount");
        require(list.buyer == address(0), "Already has a buyer");

        list.buyer = msg.sender; // บันทึกชื่อคนซื้อไว้ในระบบกักเงิน
    }

    /**
     * @dev [Step 3: Verification] สำหรับหน้า Escrow (ปุ่ม Confirm)
     * ยืนยันว่าได้รับสินค้าจริง (Physical) เรียบร้อยแล้ว
     */
    function confirm(uint256 tokenId) external {
        require(listings[tokenId].buyer == msg.sender, "Only buyer can confirm");
        listings[tokenId].confirmed = true;
    }

    /**
     * @dev [Step 4: Atomic Swap] สำหรับหน้า Escrow (ปุ่ม Execute)
     * สลับเงินให้คนขาย และ ส่ง NFT ให้คนซื้อ
     */
    function swap(uint256 tokenId) external nonReentrant {
        Listing storage list = listings[tokenId];
        require(list.active && list.confirmed, "Verification not done");

        list.active = false; // ปิดรายการขาย

        // โอนเงิน ETH ให้คนขาย
        payable(list.seller).transfer(list.price);
        // โอน NFT ให้คนซื้อ (จบการเปลี่ยนเจ้าของบน Blockchain)
        nftContract.safeTransferFrom(address(this), list.buyer, tokenId);
    }

    /**
     * @dev [Trading Floor] สำหรับหน้า Trading (ปุ่ม Buy ครั้งเดียวจบ)
     * ทำงานเหมือน Step 2+3+4 รวมกันในคลิกเดียว
     */
    function tradingBuy(uint256 tokenId) external payable nonReentrant {
        Listing storage list = listings[tokenId];
        require(list.active , "Not for sale");

        list.active = false; // ปิดรายการขาย

        // โอนเงิน ETH ให้คนขาย
        payable(list.seller).transfer(list.price);
        // โอน NFT ให้คนซื้อ (จบการเปลี่ยนเจ้าของบน Blockchain)
        nftContract.safeTransferFrom(address(this), list.buyer, tokenId);
    }
}
