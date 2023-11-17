const express = require("express");
const router = express.Router({ mergeParams: true });
const { body, validationResult } = require("express-validator");

const Comment = require("../models/comment");

router.get("/", async (req, res) => {
    res.json({ message: `hello post ${req.params.postId} comments` });
});

router.get("/:commentId", async (req, res) => {
    res.json({
        message: `hello post ${req.params.postId} comment ${req.params.commentId}`,
    });
});

module.exports = router;
