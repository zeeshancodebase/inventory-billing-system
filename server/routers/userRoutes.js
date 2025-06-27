const express = require('express');
const router = express.Router();
const userController = require("../controllers/userControllers");
const authMiddleware = require('../middlewares/authMiddleware');

// *--------------------------
// * Staff Related Routes
// *--------------------------

router.post('/login', userController.login);
router.get('/getCurrentUser', authMiddleware, userController.getCurrentUser);
router.route("/addStaff").post(userController.addStaff);
router.get('/getAllStaff', userController.getAllStaff);
router.delete('/deleteStaff/:id', userController.deleteStaff);
router.patch('/updateStaff/:id', userController.updateStaff);
router.patch('/deactivateStaff/:id', userController.deactivateStaff);
router.patch('/reactivateStaff/:id', userController.reactivateStaff);

module.exports = router;
