const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
//const verifyJWT = require("../middleware/verifyJWT");

router.post("/:id/comments", createComment);
router.get("/:id/comments", getComments);
router.put("/:id/comments/:comment_id", updateComment);
router.delete("/:id/comments/:comment_id", deleteComment);

module.exports = router;
