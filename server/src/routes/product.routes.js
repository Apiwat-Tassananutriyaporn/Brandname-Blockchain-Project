const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.patch("/register", productController.registerProductToUser);
router.post("/add", productController.addProduct);
router.get("/get", productController.getAllProducts);
router.get("/asset", productController.getMyAsset);
router.patch("/:id/sellasset", productController.sellAsset);
router.get("/trading", productController.trading);
router.patch("/:id/buyproduct", productController.buyproduct);
// router.post("/get", productController.getAllCollection);
// router.patch("/:id/buy", productController.buyproduct);


module.exports = router;