const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




exports.registerProductToUser = async (req, res) => {
    const { serial, email } = req.body;
    console.log("Registering serial:", serial, "to email:", email);
    
    try {
        // 1. ตรวจสอบ User (ต้องดึง index [0] ออกมา)
        const [users] = await req.db.query("SELECT id FROM user WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้งานที่ใช้อีเมลนี้" });
        }
        const targetUserId = users[0].id;

        // 2. ดึงข้อมูลสินค้า "ก่อน" อัปเดต เพื่อเก็บประวัติเจ้าของเดิม
        const [products] = await req.db.query("SELECT id, token_id, current_owner_id FROM product WHERE serial = ?", [serial]);
        if (products.length === 0) {
            return res.status(404).json({ message: "ไม่พบสินค้าในระบบ" });
        }
        const productData = products[0];

        // 3. บันทึกประวัติการเปลี่ยนมือ (Ownership History)
        // from_user_id คือเจ้าของเก่า, to_user_id คือ targetUserId (คนใหม่)
        await req.db.query(
            "INSERT INTO ownership_history (product_id, token_id, from_user_id, to_user_id) VALUES (?, ?, ?, ?)", 
            [productData.id, productData.token_id, productData.current_owner_id, targetUserId]
        );

        // 4. อัปเดตเจ้าของปัจจุบันในตาราง product
        await req.db.query(
            "UPDATE product SET status = 'With Owner', current_owner_id = ? WHERE serial = ?", 
            [targetUserId, serial]
        );

        console.log("Database updated successfully for serial:", serial);
        res.json({ message: "Register product successful!" });

    } catch (error) {
        console.error("Backend Register Error:", error);
        res.status(500).json({
            message: "Something went wrong in Backend",
            error: error.message
        });
    }
};

exports.getWalletAddress = async (req, res) => {
    const {email} = req.body
     try{
        const [user] = await req.db.query("SELECT wallet_address FROM user WHERE email = ?", email)

        if (user.length === 0 || !user[0].wallet_address) {
            return res.status(404).json({ message: "ไม่พบ Wallet Address ของอีเมลนี้" });
        }

        res.json({
            message: "SELECT complete!",
            data: user[0].wallet_address
        })

    }catch(error){
        console.log("can not get walltet address")
        res.status(500).json({
            message: "something wrong",
            error
        })
    }
};

exports.addProduct = async (req, res) => {
    const product = req.body
    console.log("product: ", product)
    try{
        let id
        let brand = product.brandName
        const user_token = req.user
        
        switch(brand) {
        case "Chanel":
            id = 1
            break;
        case "Louis Vuitton":
            id =2
            break;
        case "Dior":
            id = 3 
            break;
        case "Gucci":
            id = 4
            break;
        }
        product.brand_id = id
        product.current_owner_id = user_token.id
        delete product.brandName
        if(product.blockchain_status === "Minted"){
            delete product.blockchain_status
            delete product.wallet_address
            if(product.type === "Real"){
                product.extra =  "NULL"
                product.change = "NULL"
                product.isPositive =  "NULL"
            }
            console.log("Again product: ", product)
            const result = await req.db.query("INSERT INTO product SET ?", product)
        }
        res.json({
            message: "Add Product succesful!!",
            product
        })
        
    }catch(error){
        console.log("error: ", error)
        res.status(400).json({
            message: error
        })
    }
};

exports.getAllProducts = async (req, res) => {

    try{
        const product = await req.db.query("SELECT * FROM product ")

        res.json({
            message: "SELECT complete!",
            data: product[0]
        })

    }catch(error){
        console.log("can not get product")
        res.status(500).json({
            message: "something wrong",
            error
        })
    }

};


exports.getMyCollection = async (req, res) => {

    try{
        const user_token = req.user
      
        const user = await req.db.query("SELECT * FROM user WHERE id = ?", user_token.id)
        const user_id = user[0][0].id


        const product = await req.db.query("SELECT * FROM product WHERE current_owner_id = ? AND status = 'With Owner' AND type = 'Real'", user_id)

        res.json({
            message: "SELECT complete!",
            data: product[0]
        })

    }catch(error){
        console.log("can not get asset")
        res.status(403).json({
            message: "authentication fail",
            error
        })
    }

};

exports.buyCollection = async (req, res) => {

    const { id } = req.params;
    try{
        const user_token = req.user

        const product = await req.db.query("SELECT * FROM product WHERE id = ?", id)
        const token_id = product[0][0].token_id
        console.log("token_id Ownership: ", token_id)
        const from_id = product[0][0].current_owner_id

        const ownershipHistory = await req.db.query("INSERT INTO ownership_history (product_id, token_id, from_user_id, to_user_id) VALUES (?, ?, ?, ?)", [id, token_id, from_id, user_token.id])
        
        const result = await req.db.query("UPDATE product SET current_owner_id = ?, status = 'With Owner' WHERE id = ? AND type='Real'", [user_token.id, id])

        
        
        res.json({
            message: "Buy Product complete!",
            result
        })

    }catch(error){
        console.log("can not get asset")
        res.status(403).json({
            message: "authentication fail",
            error
        })
    }
};


exports.sellCollection = async (req, res) => {
    let id = req.params.id
    const user_token = req.user
    try{
        const result = await req.db.query("UPDATE product SET status = 'Sold' WHERE id = ? AND current_owner_id = ? ", [id, user_token.id])
        res.json({
            message: "Sell Collection complete!"
        })
    }catch(error){
        console.log("errorMessage: ",error.message)

        res.status(500).json({
            message: "something wrong",
        })
    }
};


exports.market = async (req, res) => {
    try{
        const product = await req.db.query("SELECT * FROM product WHERE status = 'Sold' AND type = 'Real'")

        res.json({
            message: "SELECT complete!",
            data: product[0]
        })

    }catch(error){
        console.log("can not get asset")
        res.status(403).json({
            message: "authentication fail",
            error
        })
    }
};


exports.getMyAsset = async (req, res) => {

    try{
        const user_token = req.user

        const user_id = user_token.id

        const product = await req.db.query("SELECT * FROM product WHERE current_owner_id = ? AND status = 'With Owner' AND type = 'Asset'", user_id)

        res.json({
            message: "SELECT complete!",
            data: product[0]
        })

    }catch(error){
        console.log("can not get asset")
        res.status(403).json({
            message: "authentication fail",
            error
        })
    }

};


exports.sellAsset = async (req, res) => {
    let id = req.params.id
    try{
        user_token = req.user
        
        const result = await req.db.query("UPDATE product SET status = 'Sold' WHERE id = ? AND current_owner_id = ?", [id, user_token.id])
        res.json({
            message: "Sell Asset complete!"
        })
    }catch(error){
        console.log("errorMessage: ",error.message)

        res.status(500).json({
            message: "something wrong",
        })
    }
};

exports.trading = async (req, res) => {
    try {
        const query = ""
            
        ;
        const [products] = await req.db.query("SELECT p.*, u.email AS owner_email FROM product p LEFT JOIN user u ON p.current_owner_id = u.id WHERE p.status IN ('Sold', 'In Custody') AND p.type = 'Asset' ");
        res.json({
            message: "SELECT complete!",
            data: products
        });

    } catch (error) {
        console.error("Error in trading:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.buyAsset = async (req, res) => {
    const { id } = req.params; // ใช้ Destructuring เพื่อความปลอดภัย
    console.log("buyAsset is called");
    try {
        const user_token = req.user;
        const [rows] = await req.db.query("SELECT * FROM product WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบสินค้าในระบบ" });
        }

        const productData = rows[0];
        const token_id = productData.token_id;
        const from_id = productData.current_owner_id;

        // บันทึกประวัติ
        await req.db.query(
            "INSERT INTO ownership_history (product_id, token_id, from_user_id, to_user_id) VALUES (?, ?, ?, ?)", 
            [id, token_id, from_id, user_token.id]
        );

        // อัปเดตเจ้าของ (เช็คเรื่อง type ให้ดี ถ้าในรูปเป็น Real ต้องแก้ให้ตรง)
        await req.db.query(
            "UPDATE product SET current_owner_id = ?, status = 'With Owner' WHERE id = ?", 
            [user_token.id, id]
        );
        console.log("successfully updated product ownership in database");
        res.json({ message: "Buy Product complete!" });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.verify = async (req, res) => {
    const { serial } = req.params;

    try {
        // 1. ดึงข้อมูลสินค้า (ใช้ Destructuring [rows] เพื่อเอาแถวข้อมูลออกมา)
        const [products] = await req.db.query("SELECT * FROM product WHERE serial = ?", [serial]);

        // ตรวจสอบว่ามีสินค้าชิ้นนี้จริงไหม
        if (products.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลสินค้าชิ้นนี้ในระบบ" });
        }

        const productData = products[0];

        // 2. ดึงประวัติการครอบครอง พร้อม Join ชื่อ-นามสกุล
        const [history] = await req.db.query(
            `SELECT 
                oh.id,
                u.firstname, 
                u.lastname, 
                oh.transfer_date 
             FROM ownership_history oh 
             JOIN user u ON oh.to_user_id = u.id 
             WHERE oh.product_id = ? 
             ORDER BY oh.transfer_date ASC`, 
            [productData.id] // ส่ง id เข้าไปเป็น parameter
        );

        // 3. ส่งข้อมูลกลับไปที่หน้าบ้าน
        res.json({
            message: "SELECT complete!",
            ProductData: productData,
            OwnershipHistory: history // ประวัติการโอนทั้งหมด
        });

    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message
        });
    }
};


