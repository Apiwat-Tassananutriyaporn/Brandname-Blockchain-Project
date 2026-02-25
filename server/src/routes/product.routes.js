const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.patch("/register", productController.registerProductToUser);
router.post("/add", productController.addProduct); //add product
router.get("/get", productController.getAllProducts);  // get all product

router.get("/collection", verifyToken, productController.getMyCollection); //get my product 0
router.patch("/:id/sellcollection", productController.sellCollection); //sell product 1
router.get("/market", productController.market);// get all products for sale 2
router.patch("/:id/buycollection", verifyToken, productController.buyCollection); // buy product 3

router.get("/asset", verifyToken, productController.getMyAsset); //get my asset 0 
router.patch("/:id/sellasset", productController.sellAsset); // sell asset 1
router.get("/trading", productController.trading); // get all assets for sale  2
router.patch("/:id/buyasset", verifyToken, productController.buyAsset);//buy asset 3

router.get("/:serial/verify", productController.verify);//buy asset 3//verify product




module.exports = router;