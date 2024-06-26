const express = require("express");
const router = express.Router({ mergeParams: true });
const { param, body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt");
passport.use(jwtStrategy);

const Post = require("../models/post");
const Comment = require("../models/comment");

const authenticateIfHeaderProvided = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token) {
    passport.authenticate("jwt", { session: false })(req, res, next);
  } else {
    next();
  }
};

const validatePost = [
  authenticateIfHeaderProvided,
  param("postId", "Must provide valid id").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    let post;
    if (req.isAuthenticated()) {
      post = await Post.findById(req.params.postId).exec();
    } else {
      post = await Post.findOne({
        _id: req.params.postId,
        publishStatus: "published",
      }).exec();
    }

    if (!post) {
      res.status(404).json({ errors: [{ msg: "Post not found" }] });
      return;
    }

    next();
  }),
];

router.use(validatePost);

// Get commments
router.get("/", [
  authenticateIfHeaderProvided,
  asyncHandler(async (req, res) => {
    let comments;
    if (req.isAuthenticated()) {
      comments = await Comment.find({ post: req.params.postId })
        .sort({ timestamp: -1 })
        .select("body creatorEmail timestamp _id post")
        .exec();
    } else {
      comments = await Comment.find({ post: req.params.postId })
        .sort({ timestamp: -1 })
        .select("body timestamp _id post")
        .exec();
    }
    res.json(comments);
  }),
]);

// Get comment by ID
router.get("/:commentId", [
  authenticateIfHeaderProvided,
  param("commentId", "Must provide valid id").isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }
    let comment;
    if (req.isAuthenticated()) {
      comment = await Comment.findById(req.params.commentId)
        .select("body creatorEmail timestamp _id post")
        .exec();
    } else {
      comment = await Comment.findById(req.params.commentId)
        .select("body timestamp _id post")
        .exec();
    }

    if (!comment) {
      res.status(404).json({ errors: [{ msg: "Comment not found" }] });
      return;
    }

    res.json(comment);
  }),
]);

// Create a comment
router.post("/", [
  body("body").trim().isLength({ min: 3 }).escape(),
  body("creatorEmail").trim().isEmail().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const comment = new Comment({
      body: req.body.body,
      creatorEmail: req.body.creatorEmail,
      post: req.params.postId,
      timestamp: new Date(),
    });

    await comment.save();

    res.json({
      _id: comment._id,
      body: comment.body,
      timestamp: comment.timestamp,
    });
  }),
]);

// Protected route

// Delete a comment
router.delete("/:commentId", [
  passport.authenticate("jwt", { session: false }),
  param("commentId", "Must provide valid id").isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const comment = await Comment.findByIdAndDelete(
      req.params.commentId
    ).select("body timestamp _id");

    res.json(comment);
  }),
]);

module.exports = router;
