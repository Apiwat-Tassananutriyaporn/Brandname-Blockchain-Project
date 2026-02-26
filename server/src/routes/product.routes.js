const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.patch("/register",verifyToken, authorizeRoles("admin"), productController.registerProductToUser);//register product 
router.post("/add",verifyToken, authorizeRoles("admin"), productController.addProduct); //add product
router.get("/get",verifyToken, authorizeRoles("admin"), productController.getAllProducts);  // get all products

router.get("/collection",verifyToken, authorizeRoles("user"), productController.getMyCollection); //get my product 
router.patch("/:id/sellcollection",verifyToken, authorizeRoles("user"), productController.sellCollection); //sell product 
router.get("/market", productController.market);// get all products for sale 2
router.patch("/:id/buycollection", verifyToken, authorizeRoles("user"), productController.buyCollection); // buy product 

router.get("/asset", verifyToken, authorizeRoles("user"), productController.getMyAsset); //get my asset  
router.patch("/:id/sellasset", verifyToken, authorizeRoles("user"), productController.sellAsset); // sell asset 
router.get("/trading", productController.trading); // get all assets for sale  
router.patch("/:id/buyasset", verifyToken, authorizeRoles("user"), productController.buyAsset);//buy asset 

router.get("/:serial/verify", productController.verify);//verify product

module.exports = router;