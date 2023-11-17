require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDb = process.env.MONGODB;
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDb);
}

var indexRouter = require("./routes/index");
const postRouter = require("./routes/postRouter");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/posts", postRouter);

module.exports = app;
