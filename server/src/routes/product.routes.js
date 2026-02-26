const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.patch("/register",verifyToken, authorizeRoles("admin"), productController.registerProductToUser);
router.post("/add",verifyToken, authorizeRoles("admin"), productController.addProduct); //add product
router.get("/get",verifyToken, authorizeRoles("admin"), productController.getAllProducts);  // get all product

router.get("/collection",verifyToken, authorizeRoles("user"), productController.getMyCollection); //get my product 0
router.patch("/:id/sellcollection",verifyToken, authorizeRoles("user"), productController.sellCollection); //sell product 1
router.get("/market", productController.market);// get all products for sale 2
router.patch("/:id/buycollection", verifyToken, authorizeRoles("user"), productController.buyCollection); // buy product 3

router.get("/asset", verifyToken, authorizeRoles("user"), productController.getMyAsset); //get my asset 0 
router.patch("/:id/sellasset", verifyToken, authorizeRoles("user"), productController.sellAsset); // sell asset 1
router.get("/trading", productController.trading); // get all assets for sale  2
router.patch("/:id/buyasset", verifyToken, authorizeRoles("user"), productController.buyAsset);//buy asset 3

router.get("/:serial/verify", productController.verify);//buy asset 3//verify product




module.exports = router;