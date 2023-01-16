const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} = require("../controllers/postController");
//const verifyJWT = require("../middleware/verifyJWT");

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/like/:id", likePost);
router.put("/unlike/:id", unlikePost);
router.post("/comment/:id", addComment);
router.delete("/comment/:id/:comment_id", deleteComment);

module.exports = router;
