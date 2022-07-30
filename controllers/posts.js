import { response } from "express"
import mongoose from "mongoose"
import PostMessages from "../model/postMessage.js"

export const getPosts = async(req, res)=>{
   try {
        const postMessages = await PostMessages.find()
        res.status(200).json(postMessages)
   } catch (error) {
       res.status(404).json({message:error.message})
   }
}

export const createPosts = async (req, res) => {
    const post = req.body

    const newPost = new PostMessages(post)
    try {
        await newPost.save();

        res.status(200).json(newPost)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const updatePost = async (req, res) =>{
    const {id: _id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return response.status(404).send('No post with the id')
    const updatePost = await PostMessages.findByIdAndUpdate(_id, {...post, _id}, {new: true})
    res.json(updatePost)
}

export const deletePost = async(req, res) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return response.status(404).send('No post with the id');
    await PostMessages.findByIdAndRemove(id);

    console.log('DELETED !');
    res.json({message: 'post deleted successfully'})
}

export const likePost = async(req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return response.status(404).send('No post with the id');
    const post = await PostMessages.findById(id);
    const updatedPost = await PostMessages.findByIdAndUpdate(id, {likeCount: post.likeCount + 1}, {new:true});
    console.log('LIKED !')
    res.json(updatedPost)
}   