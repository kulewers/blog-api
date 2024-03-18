require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Auth setup
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwtStrategy = require("./strategies/jwt");
passport.use(jwtStrategy);

const bcrypt = require("bcryptjs");
const User = require("./models/user");

// DB setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDb = process.env.MONGODB;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDb);
}

const app = express();

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  next();
});

app.post(
  "/test-auth",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({
      message: "success",
      username: req.user.username,
    });
  }
);

app.post("/login", async (req, res) => {
  let { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.stastus(401).json({ message: "Invalid username or password" });
  }
  const secret = process.env.SECRET;
  const token = jwt.sign({ username }, secret, { expiresIn: 3600 * 24 * 14 });
  return res.json({
    message: "Auth passed",
    token,
  });
});

const postRouter = require("./routes/postRouter");
app.use("/posts", postRouter);

module.exports = app;
