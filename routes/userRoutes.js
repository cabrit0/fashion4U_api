const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyJWT, getProfile);
router.put("/profile", verifyJWT, updateProfile);
router.put("/password", verifyJWT, changePassword);
router.delete("/profile", verifyJWT, deleteProfile);

module.exports = router;
