// กำหนดโครงสร้างข้อมูล User (Schema)
export interface UserRegister {
  id: string;
  name: string;
  email: string;
  password?: string; // ในระบบจริงจะไม่แสดงผล หรือต้องเข้ารหัส
  phoneNumber: string;
  idCard: string;
  registeredAt: string;
  walletAddress?: string; // เผื่อไว้สำหรับเชื่อม Blockchain
}

// ข้อมูลตัวอย่างสำหรับหน้า Admin เพื่อดูรายชื่อผู้สมัคร
export const mockRegisteredUsers: UserRegister[] = [
  {
    id: "usr_001",
    name: "สมชาย รักหรู",
    email: "somchai@email.com",
    phoneNumber: "081-234-5678",
    idCard: "1-1002-xxxxx-xx-x",
    registeredAt: "2024-02-20 10:30",
    walletAddress: "0x71C...3921"
  },
  {
    id: "usr_002",
    name: "วิภาดา แบรนด์เนม",
    email: "vipada.b@email.com",
    phoneNumber: "089-876-5432",
    idCard: "3-4005-xxxxx-xx-x",
    registeredAt: "2024-02-21 14:15",
    walletAddress: "0x45A...8820"
  }
];