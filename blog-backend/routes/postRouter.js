const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const commentRouter = require("./commentRouter");

const Post = require("../models/post");

router.use("/:postId/comments", commentRouter);

// Get all posts
router.get("/", async (req, res) => {
    let posts;
    if (!req.user) {
        posts = await Post.find({ publishStatus: "published" })
            .sort({ timestamp: -1 })
            .exec();
    } else {
        posts = await Post.find({}).sort({ timestamp: -1 }).exec();
    }
    res.json(posts);
});

// Get a post by ID
router.get("/:postId", [
    param("postId", "Must provide valid id").isMongoId(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        let post;
        if (!req.user) {
            post = await Post.findOne({
                _id: req.params.postId,
                publishStatus: "published",
            }).exec();
        } else {
            post = await Post.findById(req.params.postId).exec();
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
    body("title").trim().isLength({ min: 3 }).escape(),
    body("body").trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req, res, next) => {
        // if (!req.user) {
        //     res.status(401).json({ msg: "Access Denied" });
        //     return;
        // }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        const publishImmedeately = req.body.publish === "on";

        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            publishStatus: publishImmedeately ? "published" : "draft",
            publishDate: publishImmedeately ? new Date() : null,
        });

        await post.save();

        res.json(post);
    }),
]);

// Update a post
router.patch("/:postId", [
    body("title").trim().isLength({ min: 3 }).escape(),
    body("body").trim().isLength({ min: 1 }).escape(),
    body("publish").escape(),
    param("postId", "Must provide valid id").isMongoId(),
    asyncHandler(async (req, res, next) => {
        // if (!req.user) {
        //     res.status(401).json({ msg: "Access Denied" });
        //     return;
        // }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        const post = await Post.findById(req.params.postId).exec();

        if (!post) {
            res.status(404).json({ errors: ["Post not found"] });
            return;
        }

        const publish = req.body.publish === "on";

        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
            publishStatus: publish ? "published" : "draft",
            publishDate: publish ? new Date() : null,
            _id: req.params.postId,
        });

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            newPost,
            { new: true }
        );

        res.json(updatedPost);
    }),
]);

// Delete a post
router.delete("/:postId", [
    param("postId", "Must provide valid id").isMongoId(),
    asyncHandler(async (req, res, next) => {
        // if (!req.user) {
        //     res.status(401).json({ msg: "Access Denied" });
        //     return;
        // }

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

        const removedPost = await Post.findByIdAndDelete(req.params.postId);
        res.json(removedPost);
    }),
]);

module.exports = router;
