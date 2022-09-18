import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFiles: String,
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String], default: []
    },
    createdAt: {
        type: Date,
        default: new Date ()
    }
})
const PostMessages = mongoose.model('PostMessages', postSchema)
export default PostMessages;
