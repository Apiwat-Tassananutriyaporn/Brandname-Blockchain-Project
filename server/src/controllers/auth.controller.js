const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.register = async (req, res) => {

    let user = req.body
    try{
        const passwordHash = await bcrypt.hash(user.password, 10)
        console.log('hash: ', passwordHash)
        user.password = passwordHash

        const idcardHash = await bcrypt.hash(user.idcard, 10)
        user.idcard = idcardHash
        await req.db.query("INSERT INTO user SET ?", user)
        res.status(201).json({
            message: "Register successful",
        });
    }catch(error){
        console.log('error: ', error)
        res.status(400).json({
        message: "Register failed",
        error
    });
    }

};


exports.login = async (req, res) =>{
    const{email, password} = req.body
    
    try{
        const result = await req.db.query("SELECT * FROM user WHERE email = ?", email)
        if(result[0].length > 0){
            console.log("email was found")
            const oldPassword = result[0][0].password
            const match = await bcrypt.compare(password, oldPassword)
            if(!match){
                return res.status(400).json({
                    message: "Password is not correct!"
                });
            }
            user = result[0][0]
            console.log("user: ", user)    
            console.log("userID: ", user.id) 
            console.log("userRole: ", user.role) 

            const token =  jwt.sign({
                id: user.id, 
                role: user.role, 
                },  process.env.JWT_SECRET, { expiresIn: '1h'})

            res.json({
                message : "Login1111 successful!",
                token: token,
                role: user.role,
                firstname: user.firstname, 
                email: user.email,
                id : user.id
            })
        }else{
            return res.status(401).json({
                message: "Email not found",
            });
        }
    }catch(error){
        console.log("Error message: ", error)
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};


