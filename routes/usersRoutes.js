const express = require("express");
const router = express.Router();
const { protect , admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImage");


const {
  createUsers,
  loginUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  logout,
  updateUserPhoto,
} = require("../controllers/usersControlleurs");

router.post("/register", createUsers);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/admin/user/:id", protect, admin, getUserById);
router.put("/update", protect, updateUserProfile); 
router.get("/allusers", protect, getAllUsers);
router.delete("/:id", protect, deleteUser);
router.post("/logout", logout);

// ✅ Nouvelle route pour la photo de profil
router.put("/update-photo", protect, upload.single("image"), updateUserPhoto);

module.exports = router;
