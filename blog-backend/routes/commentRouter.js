const express = require("express");
const router = express.Router({ mergeParams: true });
const { param, body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Post = require("../models/post");
const Comment = require("../models/comment");

const postExistsValidation = [
    param("postId", "Must provide valid id").isMongoId(),
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

        if (!post) {
            res.status(404).json({ errors: ["Post not found"] });
            return;
        }

        next();
    }),
];

router.use(postExistsValidation);

// Get commments
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const comments = await Comment.find({ post: req.body.postId })
            .sort({ timestamp: -1 })
            .exec();
        res.json({ comments });
    })
);

// Get comment by ID
router.get("/:commentId", [
    param("commentId", "Must provide valid id").isMongoId(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        const comment = await Comment.findById(req.params.commentId).exec();

        if (!comment) {
            res.status(404).json({ errors: ["Comment not found"] });
            return;
        }

        res.json({ comment });
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

        res.json({ comment });
    }),
]);

// Protected route

// Delete a comment
router.delete("/:commentId", [
    param("commentId", "Must provide valid id").isMongoId(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        const comment = await Comment.findByIdAndDelete(req.params.commentId);

        res.json({ comment });
    }),
]);

module.exports = router;
