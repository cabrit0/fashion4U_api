const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @Access  Private
const createComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar,
    };
    post.comments.unshift(newComment);
    await post.save();
    res.status(201).json({ success: true, data: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @Access  Public
const getComments = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(200).json({ success: true, data: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @desc    Update a comment
// @route   PUT /api/posts/:id/comments/:comment_id
// @Access  Private
const updateComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, error: "Comment not found" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to update comment" });
    }
    comment.text = req.body.text;
    await post.save();
    res.status(200).json({ success: true, data: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @desc Delete a comment
// @route DELETE /api/posts/:id/comments/:comment_id
// @Access Private
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, error: "Comment not found" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to delete comment" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.status(200).json({ success: true, data: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
