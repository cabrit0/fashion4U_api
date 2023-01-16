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
//const verifyJWT = require("../middleware/verifyJWT");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.delete("/profile", deleteProfile);

module.exports = router;
