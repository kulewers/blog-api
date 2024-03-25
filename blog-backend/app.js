require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Auth setup
const passport = require("passport");
const jwtStrategy = require("./strategies/jwt");
passport.use(jwtStrategy);

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

const loginRouter = require("./routes/loginRouter");
const postRouter = require("./routes/postRouter");
app.use("/login", loginRouter);
app.use("/posts", postRouter);

module.exports = app;
