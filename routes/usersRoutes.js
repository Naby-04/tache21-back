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
        logout,
        loginWithGoogle
    } = require("../controllers/usersControlleurs");
const { forgetPassword , resetPassword} = require("../controllers/forgetPassword");

router.post("/register", createUsers);

router.post("/login", loginUser);

router.get("/profile",protect, getUserProfile);

router.get("/admin/user/:id", protect, admin, getUserById);

router.put("/update", protect, updateUserProfile); 

router.get("/allusers", protect ,  getAllUsers);

router.delete("/:id", protect,  deleteUser);


router.post("/logout", logout),

router.post("/forget-password", forgetPassword)

router.post("/reset-password/:token", resetPassword)



router.post("/google-login", loginWithGoogle);


module.exports = router