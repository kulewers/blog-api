const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

router.post("/", [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Password must be at least 5 characters long"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Invalid username or password" }] });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Invalid username or password" }] });
    }
    const secret = process.env.SECRET;
    const token = jwt.sign({ username }, secret, { expiresIn: 3600 * 24 * 14 });
    return res.json({
      message: "Auth passed",
      token,
    });
  }),
]);

module.exports = router;
