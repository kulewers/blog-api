const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const commentRouter = require("./commentRouter");
router.use("/:postId/comments", commentRouter);

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt");
passport.use(jwtStrategy);

const Post = require("../models/post");

const authenticateIfHeaderProvided = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token) {
    passport.authenticate("jwt", { session: false })(req, res, next);
  } else {
    next();
  }
};

// Get all posts
router.get("/", [
  authenticateIfHeaderProvided,
  asyncHandler(async (req, res, next) => {
    let posts;
    if (req.isAuthenticated()) {
      posts = await Post.find({})
        .sort({ timestamp: -1 })
        .select("title body publishDate publishStatus _id")
        .exec();
    } else {
      posts = await Post.find({ publishStatus: "published" })
        .sort({ timestamp: -1 })
        .select("title body publishDate _id")
        .exec();
    }
    res.json(posts);
  }),
]);

// Get a post by ID
router.get("/:postId", [
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
      post = await Post.findById(req.params.postId)
        .select("title body publishDate publishStatus _id")
        .exec();
    } else {
      post = await Post.findOne({
        _id: req.params.postId,
        publishStatus: "published",
      })
        .select("title body publishDate _id")
        .exec();
    }

    if (!post) {
      res.status(404).json({ errors: [{ msg: "Post not found" }] });
      return;
    }

    res.json(post);
  }),
]);

// Protected Routes

// Create a post
router.post("/", [
  passport.authenticate("jwt", { session: false }),
  body("title").trim().isLength({ min: 3 }).escape(),
  body("body").trim().isLength({ min: 1 }).escape(),
  body("publish").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      publishStatus: req.body.publish ? "published" : "draft",
      publishDate: req.body.publish ? new Date() : null,
    });

    await post.save();

    res.json({
      _id: post._id,
      title: post.title,
      body: post.body,
      publishDate: post.publishDate,
    });
  }),
]);

// Update a post
router.patch("/:postId", [
  passport.authenticate("jwt", { session: false }),
  body("title").trim().isLength({ min: 3 }).escape(),
  body("body").trim().isLength({ min: 1 }).escape(),
  body("publish").escape(),
  param("postId", "Must provide valid id").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const post = await Post.findById(req.params.postId).exec();

    if (!post) {
      res.status(404).json({ errors: [{ msg: "Post not found" }] });
      return;
    }

    req.body.publish = req.body.publish === "true";

    const updatedDate =
      post.publishStatus === "draft" ? new Date() : post.publishDate;

    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      publishStatus: req.body.publish ? "published" : "draft",
      publishDate: req.body.publish ? updatedDate : null,
      _id: req.params.postId,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      newPost,
      { new: true }
    ).select("title body publishDate publishStatus _id");

    res.json(updatedPost);
  }),
]);

// Delete a post
router.delete("/:postId", [
  passport.authenticate("jwt", { session: false }),
  param("postId", "Must provide valid id").isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const post = await Post.findById(req.params.postId).exec();

    if (!post) {
      res.status(404).json({ errors: [{ msg: "Post not found" }] });
      return;
    }

    const removedPost = await Post.findByIdAndDelete(req.params.postId).select(
      "title body publishDate publishStatus _id"
    );
    res.json(removedPost);
  }),
]);

module.exports = router;
