### 1. ติดตั้ง Dependencies
npm install @openzeppelin/contracts@4.9.0

### 2. การคอมไพล์และ Deploy
ตรวจสอบให้แน่ใจว่าเปิด Ganache อยู่ จากนั้นรัน:
truffle compile
truffle migrate --reset

### คำอธิบายสำหรับ Front-end & Back-end
หน้า Admin (ลงทะเบียนสินค้า)
Front-end: เรียก mint(wallet_เจ้าของ, serial_number)
Back-end: เมื่อ Transaction สำเร็จ (ได้ Hash) ให้เอา tokenId ที่ได้จาก Blockchain ไป UPDATE ลงในตาราง products เพื่อเชื่อมข้อมูล Serial กับ ID ให้ตรงกัน

หน้า My Collection (ฝากขาย)
Front-end: ต้องเรียก approve(escrow_address, tokenId) ในสัญญา NFT ก่อน แล้วค่อยเรียก listProduct(tokenId, price)
Back-end: อัปเดตสถานะใน SQL เป็น 'Escrow Locked'

หน้า Market (Escrow 4 Steps)
ปุ่ม Buy (Step 2): เรียก buy(tokenId) พร้อมส่งเงินเข้า Contract
ปุ่ม Confirm (Step 3): เรียก confirm(tokenId) เมื่อได้รับของจริง

ปุ่ม Swap (Step 4): เรียก swap(tokenId) เพื่อจบงาน
Back-end: เมื่อจบ Step 4 ให้ UPDATE current_owner ใน MySQL เป็นคนซื้อทันที

หน้า Trading Floor 
Front-end: เรียก tradingBuy(tokenId) ครั้งเดียวจบ (เงินโอน ของเปลี่ยนมือทันที)
Back-end: ต้อง UPDATE ชื่อเจ้าของใน SQL ทันทีหลัง Transaction สำเร็จ เพราะเจ้าของใน Blockchain เปลี่ยนไปแล้ว

หน้า Verify 
Front-end: รับ Serial จาก User -> เรียก serialToTokenId(serial)
Logic: ถ้าได้เลข ID > 0 แสดงว่าของแท้! ให้เอา ID นั้นไป Query ใน Database เพื่อดึงรายละเอียด (Brand, Model, Color) มาโชว์คู่กัน
