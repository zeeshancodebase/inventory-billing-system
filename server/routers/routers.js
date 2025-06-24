const express = require('express');
const router = express.Router();
const userController = require("../controllers/userControllers");
const productController = require("../controllers/productController");

// *--------------------------
// * Staff Related Routes
// *--------------------------

// router.post('/login', userController.login);
// router.route("/addStaff").post(userController.addStaff);
// router.get('/getAllStaff', userController.getAllStaff);
// router.delete('/deleteStaff/:id', userController.deleteStaff);
// router.put('/updateStaff/:id', userController.updateStaff);



// *--------------------------
// * Product Related Routes
// *--------------------------
router.route("/addproduct").post(productController.addProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.delete('/deleteProduct/:id', productController.deleteProduct);
router.put('/updateProduct/:id', productController.updateProduct);



module.exports = router;