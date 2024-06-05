const User = require("../models/userSchema");
const express = require("express");
const { isAuthenticate } = require("../middleware/auth");
const router = express.Router();
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");
const { upload } = require("../middleware/multer");
const getDataUri = require("../utils/DataUri");
const cloudinary = require("cloudinary");
router.route("/new/post").post(isAuthenticate, upload, uploadNewPost);

async function uploadNewPost(req, res) {
  try {
    const files = req.files;
    const { postType } = req.body;
    const posts = [];
    for (let i = 0; i < files.length; i++) {
      const fileUri = getDataUri(files[i]);
      const fileType = fileUri.mimetype.substring(
        0,
        fileUri.mimetype.indexOf("/")
      );
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        resource_type: "auto",
      });
      let postObj = { url: myCloud.url, uid: myCloud.public_id, fileType };
      posts.push(postObj);
    }
    const post = await Post.create({
      posts,
      createdBy: req.user._id,
      postType,
      isPublic: req.user.isPublic,
    });
    await User.findByIdAndUpdate(req.user._id, {
      numberOfPosts: req.user.numberOfPosts + 1,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
}
router.route("/reels").get(sendReels);
async function sendReels(req, res) {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 8;
    let skip = (page - 1) * limit;
    const totalResult = await Post.find({ postType: "reel" }).count();
    const reels = await Post.find({ postType: "reel" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy");
    let totalResultSend = (page - 1) * limit + reels.length;
    let hasMore = totalResultSend < totalResult;
    res.status(200).json({ reels, totalResult, hasMore });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "somthing went wrong" });
  }
}

router.route("/upload").post(isAuthenticate, upload, uploadData);
async function uploadData(req, res) {
  try {
    const file = req.file;
    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      resource_type: "auto",
    });
    res.status(200).json({ success: "true" });
  } catch (error) {
    console.log(error);
  }
}
router.route("/like/:id").patch(isAuthenticate, likePost);
async function likePost(req, res) {
  try {
    let post = await Post.findById(req.params.id);
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { likes: post.likes + 1, $push: { likedBy: req.user._id } },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}
router.route("/dislike/:id").patch(isAuthenticate, disLikePost);
async function disLikePost(req, res) {
  try {
    let post = await Post.findById(req.params.id);
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { likes: post.likes - 1, $pull: { likedBy: req.user._id } },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}
router.route("/suggestedPosts").get(isAuthenticate, sendSuggestedPosts);
async function sendSuggestedPosts(req, res) {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy");
    const totalPosts = await Post.find().count();
    const totalResultSend = (page - 1) * limit + posts.length;
    let hasMore = totalResultSend < totalPosts ? true : false;
    res.status(200).json({ posts, hasMore });
  } catch (error) {
    res.status(400).json({ error: "somthing went wrong" });
  }
}
router
  .route("/addComment/:id")
  .post(isAuthenticate, addComment)
  .get(isAuthenticate, sendComments);
async function sendComments(req, res) {
  try {
    const comments = await Comment.findOne({ postId: req.params.id }).populate(
      "comments.submittedBy"
    );
    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({ error: "somthing went wrong" });
  }
}
async function addComment(req, res) {
  try {
    // if(comments.length>0){
    //     comments=await Comment.findOneAndUpdate({postId:req.params.id},{$push:{comments:{comment:req.body.comment,submittedBy:req.user._id}}})
    // }else{
    //      comments=await Comment.create({postId:req.params.id,comments:[{comment:req.body.comment,submittedBy:req.user._id}]})
    //     console.log("data",comments);
    // }
    const data = await Comment.findOne({ postId: req.params.id });
    if (data !== null) {
      const comments = await Comment.findOneAndUpdate(
        { postId: req.params.id },
        {
          $push: {
            comments: { comment: req.body.comment, submittedBy: req.user._id },
          },
        },
        { new: true }
      ).populate("comments.submittedBy");
      res.status(200).json({ comments });
    } else {
      let comments = await Comment.create({
        postId: req.params.id,
        comments: [{ comment: req.body.comment, submittedBy: req.user._id }],
      });
      comments = await Comment.findOne(
        { postId: req.params.id }
      ).populate("comments.submittedBy");
      res.status(200).json({ comments });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "somthing went wrong" });
  }
}
module.exports = router;
