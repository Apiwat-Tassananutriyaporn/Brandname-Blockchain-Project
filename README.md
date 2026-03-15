### 1. ติดตั้ง Dependencies
npm install @openzeppelin/contracts@4.9.0

### 2. การคอมไพล์และ Deploy
ตรวจสอบให้แน่ใจว่าเปิด Ganache อยู่ จากนั้นรัน:
truffle compile
truffle migrate --reset



## รายละเอียดฟังก์ชันใน Smart Contract

| ฟังก์ชัน | Input ที่ต้องส่งมา | สิ่งที่ Return ออกมา (Output) | การนำไปใช้ต่อ |
| :--- | :--- | :--- | :--- |
| **mint** | `to (address)`, `serial (string)` | `uint256 (tokenId)` | ให้ Back-end เอาเลข ID นี้ไปเก็บลง Database |
| **getOwnerBySerial** | `serial (string)` | `address (owner)` | เอาไปเช็คว่าตรงกับคนดูไหม หรือโชว์ Wallet เจ้าของ |
| **listProduct** | `tokenId`, `price` | None | เมื่อสำเร็จ สถานะสินค้าในสัญญาจะกลายเป็น Active |
| **buy** | `tokenId` (+ ส่งเงิน ETH) | None | เงินจะถูกกักไว้ และบันทึก Address คนซื้อลงในระบบ |
| **confirm** | `tokenId` | None | เปลี่ยนสถานะ confirmed เป็น True (Step 3) |
| **swap** | `tokenId` | None | จบดีล: ของเข้ากระเป๋าผู้ซื้อ และเงินเข้ากระเป๋าผู้ขาย |
| **tradingBuy** | `tokenId` (+ ส่งเงิน ETH) | None | จบในคำสั่งเดียว: ของและเงินสลับมือกันทันที |

---

## 💻 คำอธิบายสำหรับการพัฒนา (Front-end & Back-end)

### 1. หน้า Admin (ลงทะเบียนสินค้า)
* **Front-end:** เรียกใช้ฟังก์ชัน `mint(wallet_เจ้าของ, serial_number)`
* **Back-end:** เมื่อ Transaction สำเร็จ (ได้ Hash) ให้ดึง `tokenId` ที่ได้จาก Blockchain ไป **UPDATE** ลงในตาราง `products` เพื่อเชื่อมข้อมูล Serial กับ ID ให้ตรงกัน

### 2. หน้า My Collection (ฝากขาย)
* **Front-end:** ต้องเรียก `approve(escrow_address, tokenId)` ในสัญญา NFT ก่อน เพื่ออนุญาตให้ระบบดึงของไปเก็บไว้ จากนั้นค่อยเรียก `listProduct(tokenId, price)`
* **Back-end:** อัปเดตสถานะใน SQL เป็น **'Escrow Locked'**

### 3. หน้า Market (Escrow 4 Steps)
* **ปุ่ม Buy (Step 2):** เรียก `buy(tokenId)` พร้อมส่งเงินเข้า Contract
* **ปุ่ม Confirm (Step 3):** เรียก `confirm(tokenId)` เมื่อผู้ซื้อได้รับของจริง
* **ปุ่ม Swap (Step 4):** เรียก `swap(tokenId)` เพื่อโอนของและเงินให้จบงาน
* **Back-end:** เมื่อจบ Step 4 ให้ **UPDATE** `current_owner` ในฐานข้อมูล MySQL เป็นคนซื้อทันที

### 4. หน้า Trading Floor
* **Front-end:** เรียก `tradingBuy(tokenId)` ครั้งเดียวจบ (เงินโอนและของเปลี่ยนมือทันที)
* **Back-end:** ต้อง **UPDATE** ชื่อเจ้าของใน SQL ทันทีหลัง Transaction สำเร็จ เนื่องจากเจ้าของใน Blockchain เปลี่ยนไปแล้ว

### 5. หน้า Verify
* **Front-end:** รับ Serial จาก User -> เรียกฟังก์ชัน `serialToTokenId(serial)`
* **Logic:** * ถ้าได้เลข ID > 0 แสดงว่าเป็นของแท้! 
    * ให้เอา ID นั้นไป Query ใน Database เพื่อดึงรายละเอียด (Brand, Model, Color) มาแสดงผลคู่กัน
