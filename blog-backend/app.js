require("dotenv").config();
var express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
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

const app = express();

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var indexRouter = require("./routes/index");
const postRouter = require("./routes/postRouter");

app.use("/", indexRouter);
app.use("/posts", postRouter);

module.exports = app;
