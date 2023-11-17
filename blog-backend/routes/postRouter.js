const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const commentRouter = require("./commentRouter");

const Post = require("../models/post");

router.use("/:postId/comments", commentRouter);

// Get all posts
router.get("/", async (req, res) => {
    const posts = await Post.find({ publishStatus: "published" })
        .sort({ timestamp: -1 })
        .exec();
    res.json({ posts });
});

// Get a post by Id
router.get("/:postId", [
    param("postId").isMongoId(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        const post = await Post.findOne({
            _id: req.params.postId,
            publishStatus: "published",
        }).exec();

        if (post === null) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        res.json({ post });
    }),
]);

// Create a post
router.post("/", [
    body("title").trim().isLength({ min: 3 }).escape(),
    body("body").trim().isLength({ min: 1 }).escape(),
    body("publish").escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const publishImmedeately = req.body.publish === "on";

        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            publishStatus: publishImmedeately ? "published" : "draft",
            publishDate: publishImmedeately ? new Date() : undefined,
        });

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        } else {
            await post.save();

            res.json({ post });
        }
    }),
]);

// TODO: Update a post
router.post("/:postId", async (req, res) => {});

module.exports = router;
