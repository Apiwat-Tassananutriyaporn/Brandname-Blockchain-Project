const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.registerProductToUser = async (req, res) => {
    const{serial, email} = req.body
    
    try{
        console.log("email: ", email)
         const [user] = await req.db.query("SELECT * FROM user WHERE email = ?", email)
        if(!user){
            throw new ("email is not found")
        }
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


exports.getMyAsset = async (req, res) => {

    try{
        const authHeader = req.headers['authorization']
        let authToken = ''
        if(authHeader){
            authToken = authHeader.split(' ')[1]
        }
        console.log("authHeader: ", authHeader)
        console.log("authToken: ", authToken)

        const user_token = jwt.verify(authToken, process.env.JWT_SECRET)
        console.log("user_token: ", user_token) // ใช้ user_token.emailได้

        console.log("user_token.email: ", user_token.email)

        const user = await req.db.query("SELECT * FROM user WHERE email = ?", user_token.email)
        const user_id = user[0][0].id

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
        const result = await req.db.query("UPDATE product SET status = 'Sold' WHERE id = ?", id)
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


exports.buyproduct = async (req, res) => {

    const id = req.params.id
    try{
        const authHeader = req.headers['authorization']
        let authToken = '' 
        if(authHeader){
            authToken = authHeader.split(' ')[1]
        }
        console.log("authHeader: ", authHeader)
        console.log("authToken: ", authToken)

        const user_token = jwt.verify(authToken, process.env.JWT_SECRET )
        console.log("user_token: ", user_token) // ใช้ user_token.emailได้
        const user = await req.db.query("SELECT * FROM user WHERE email = ?", user_token.email)
        
        const result = await req.db.query("UPDATE product SET current_owner_id = ?, status = 'With Owner' WHERE id = ?", [user[0][0].id, id])

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



