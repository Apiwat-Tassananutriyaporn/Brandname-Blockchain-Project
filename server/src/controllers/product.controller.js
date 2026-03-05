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

exports.addProduct = async (req, res) => {
    const product = req.body

    try{
        let id
        let brand = product.Brand
        
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
        delete product.Brand
        const result = await req.db.query("INSERT INTO product SET ?", product)
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
        console.log("user_token: ", user_token) // ใช้ user_token.idได้

        console.log("user_token.id: ", user_token.id)

        const user = await req.db.query("SELECT * FROM user WHERE id = ?", user_token.id)
        const user_id = user[0][0].id

        console.log("user_id: ", user_id)

        const product = await req.db.query("SELECT * FROM product WHERE current_owner_id = ? AND status = 'With Owner' AND type = 'Real'", user_id)
        console.log("product: ", product[0])

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

    const id = req.params.id
    try{
        const user_token = req.user
        console.log("user_token: ", user_token) // ใช้ user_token.idได้
        
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
    try{
        const result = await req.db.query("UPDATE product SET status = 'Sold' WHERE id = ? AND current_owner_id =  ", id)
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
        console.log("user_token: ", user_token) // ใช้ user_token.idได้

        const user_id = user_token.id
        console.log("user_id: ", user_id)

        const product = await req.db.query("SELECT * FROM product WHERE current_owner_id = ? AND status = 'With Owner' AND type = 'Asset'", user_id)
        console.log("product: ", product[0])

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
    try{
        const product = await req.db.query("SELECT * FROM product WHERE status = 'Sold' AND type = 'Asset'")

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

exports.buyAsset = async (req, res) => {

    const id = req.params.id
    try{
        const user_token = req.user
        console.log("user_token: ", user_token) // ใช้ user_token.idได้

        const product = await req.db.query("SELECT * FROM product WHERE id = ? AND type='Asset'", id)
        const oldOwnerId = product[0][0].current_owner_id
        console.log("oldOwnerId: ", oldOwnerId)
        
        const result = await req.db.query("UPDATE product SET current_owner_id = ?, status = 'With Owner' WHERE id = ? AND type='Asset'", [user_token.id, id])

        // const history = await req.db.query("INSERT INTO `ownership_history`(`product_id`, `from_user_id`, `to_user_id`) VALUES (?, ?, ?, ?)", [id, oldOwnerId, user_token.id])

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


