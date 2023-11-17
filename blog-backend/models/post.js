const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 3 },
    body: { type: String, required: true },
    publishStatus: {
        type: String,
        enum: ["published", "draft"],
        default: "draft",
    },
    publishDate: Date,
});

PostSchema.virtual("url").get(function () {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
