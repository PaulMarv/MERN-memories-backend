import { response } from "express"
import mongoose from "mongoose"
import PostMessages from "../model/postMessage.js"


export const getPosts = async(req, res)=>{
    const {page} = req.query;
   try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; //GET START INDEX OF EVERY PAGE
        const total = await PostMessages.countDocuments({})

        const posts = await PostMessages.find().sort({_id: -1}).limit(LIMIT).skip(startIndex)
        res.status(200).json({data:posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});

   } catch (error) {
       res.status(404).json({message:error.message})
   }
}

export const getPost = async (req, res) => {
    const {id} = req.params

    try {
        const post = await PostMessages.findById(id);
        res.status(200).json(post)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getPostsBySearch = async(req, res) =>{
    const {searchQuery, tags} = req.query

    try {
        const title = new RegExp(searchQuery, 'i')

        const posts = await PostMessages.find({$or: [ {title}, {tags:{$in: tags.split(',')}}]})

        res.json({data: posts})
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

export const createPosts = async (req, res) => {
    const post = req.body

    const newPost = new PostMessages({...post, creator: req.userId, createdAt: new Date().toISOString()})
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

    res.json({message: 'post deleted successfully'})
}

export const likePost = async(req, res) => {

    const {id} = req.params;

    if(!req.userId) return res.json({message:'unAuthenticated'})

    if(!mongoose.Types.ObjectId.isValid(id)) return response.status(404).send('No post with the id');
    
    const post = await PostMessages.findById(id);

    const index = post.likes.findIndex((id)=> id === String(req.userId)) // check if a user already liked a post

    if(index === -1){
        //like a post
        post.likes.push(req.userId)
    }else{
        //dislike apost
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }   
    
    const updatedPost = await PostMessages.findByIdAndUpdate(id, post, {new:true});
    
    res.json(updatedPost)
}   