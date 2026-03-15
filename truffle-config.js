module.exports = {
  networks: {
    // จุดที่ 1: ตั้งค่าการเชื่อมต่อกับ Ganache
    development: {
      host: "127.0.0.1",     // IP ของเครื่องเรา
      port: 7545,            // Port พื้นฐานของ Ganache GUI
      network_id: "*",       // ยอมรับ Network ID ทุกรูปแบบ
    },
  },

  compilers: {
    solc: {
      // จุดที่ 2: ตั้งค่า Compiler ให้ตรงกับที่เราเขียนใน Smart Contract
      version: "0.8.19",      
      settings: {          
        optimizer: {
          enabled: true,
          runs: 200
        },
        // ป้องกัน Error เกี่ยวกับคำสั่ง mcopy ในเวอร์ชันใหม่ๆ
        evmVersion: "paris" 
      }
    }
  }
};