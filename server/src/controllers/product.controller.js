const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




exports.registerProductToUser = async (req, res) => {
    const{serial, email} = req.body
    
    try{
        console.log("email: ", email)
         const [user] = await req.db.query("SELECT * FROM user WHERE email = ?", email)
         console.log("user: ", user)
        if(!user){
            throw new ("email is not found")
        }
        console.log("user: ", user[0])
        const result = await req.db.query("UPDATE product SET status = 'With Owner', current_owner_id  = ? WHERE serial = ?", [user[0].id, serial])
        res.json({
            message: "resgister product succesful!"
        })
    }catch(error){
        console.log("errorMessage: ",error.message)

        res.status(500).json({
            message: "something wrong",
        })
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

exports.OwnerShipHistory = async (req, res) => {
    const id = req.params.id

    try{
        const user_token = req.user
      
        
       
        res.json({
            message: "INSERT OwnerShipHistory complete!"
        })

    }catch(error){
        console.log("can INSERT ownership history")
        res.status(403).json({
            message: "authentication fail",
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

    const id = req.params.id
    try{
        const user_token = req.user
        console.log("user_token: ", user_token) // ใช้ user_token.idได้

        const product = await req.db.query("SELECT * FROM product WHERE id = ? AND type='Asset'", id)
        // id ของเจ้าของเก่า
        const oldOwnerId = product[0][0].current_owner_id
        // wallet address ของเจ้าของเก่า --- oldOwnerWallet[0][0].wallet_address
        const oldOwnerWallet = await req.db.query("SELECT wallet_address FROM user WHERE id = ?", oldOwnerId)
        // wallet address ของเจ้าของใหม่ --- newOwnerWallet[0][0].wallet_address
        const newOwnerWallet = await req.db.query("SELECT wallet_address FROM user WHERE id = ?", user_token.id)
        console.log("oldOwnerId: ", oldOwnerId)
        console.log("oldOwnerWallet: ", oldOwnerWallet[0][0].wallet_address)
        console.log("newOwnerWallet: ", newOwnerWallet[0][0].wallet_address)

        const result = await req.db.query("UPDATE product SET current_owner_id = ?, status = 'With Owner' WHERE id = ? AND type='Asset'", [user_token.id, id])

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


exports.verify = async (req, res) => {
    
    const serial = req.params.serial 

    try{
        const product = await req.db.query("SELECT * FROM product WHERE serial = ? ", serial)

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


