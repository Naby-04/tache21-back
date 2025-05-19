const express = require("express");
const router = express.Router();
const { protect , admin } = require("../middlewares/authMiddleware")
const {createUsers,
        loginUser, 
        getUserProfile , 
        getUserById,
        updateUserProfile,
        getAllUsers,
        deleteUser ,
        forgotPassword,
        resetPassword
    } = require("../controllers/usersControlleurs");

router.post("/register", createUsers);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

router.get("/admin/user/:id", protect, admin, getUserById);

router.put("/update", protect, updateUserProfile); 

router.get("/allusers", protect, admin ,  getAllUsers);

router.delete("/:id", protect, admin , deleteUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword)




module.exports = router