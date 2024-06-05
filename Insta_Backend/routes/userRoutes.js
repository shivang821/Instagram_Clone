const User = require("../models/userSchema");
const Posts = require("../models/postSchema");
const express = require("express");
const sendToken = require("../utils/sendTolen");
const { isAuthenticate } = require("../middleware/auth");
const { upload } = require("../middleware/multer");
const getDataUri = require("../utils/DataUri");
const router = express.Router();
const cloudinary = require("cloudinary");
router.route("/signup").post(signUpUser);
async function signUpUser(req, res) {
  try {
    const { email, name, password, username } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ sucess: false, message: "username already exist" });
    }
    user = await User.create({ email, name, password, username });
    user.posts = 0;
    sendToken(user, 200, res, "user signup successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, success: false });
  }
}
router.route("/login").post(loginUser);

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "please enter username and password",
      });
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const posts = await Posts.find({ createdBy: user._id });
      user.numberOfPosts = posts.length;
      sendToken(user, 200, res, "user loged in successfully");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "invalid details" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
}

router
  .route("/me")
  .get(isAuthenticate, getDetails)
  .patch(isAuthenticate, upload, updateUser);

async function getDetails(req, res) {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const posts = await Posts.find({ createdBy: user._id });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
}
async function updateUser(req, res) {
  try {
    const file = req.files[0];
    const fileUri = getDataUri(file);
    let user = req.user;
    if (user.profile.uid) {
      const de = await cloudinary.v2.uploader.destroy(user.profile.uid);
    }
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      resource_type: "auto",
    });
    user = await User.findByIdAndUpdate(
      user._id,
      { profile: { uid: myCloud.public_id, url: myCloud.url } },
      { new: true }
    );
    res.status(200).json({ success: "true" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "somthing went wrong" });
  }
}
router.route("/myposts").get(isAuthenticate, sendMyPosts);
async function sendMyPosts(req, res) {
  try {
    const posts = await Posts.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "somthing went wrong" });
  }
}
router.route("/myreels").get(isAuthenticate, sendMyReels);
async function sendMyReels(req, res) {
  try {
    const reels = await Posts.find({
      createdBy: req.user._id,
      postType: "reel",
    }).sort({ createdAt: -1 });
    res.status(200).json({ reels });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "somthing went wrong" });
  }
}
router.route("/usage").patch(isAuthenticate, setUsage);
async function setUsage(req, res) {
  try {
    const user=await User.findByIdAndUpdate(req.user._id,{$inc:{screenTime:1}},{new:true})
    if(user.screenTime>=user.dailyLimit){
      res.status(200).json({exceed:true,screenTime:user.screenTime})
    }else{
      res.status(200).json({ exceed: false ,screenTime:user.screenTime});
    }
  } catch (error) {
    res.status(400).json({ error: "somthing went wrong" });
    console.log(error);
  }
}
router.route("/logout").get(logOutUser);

async function logOutUser(req, res) {
  try {
    res.cookie("instaToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: "user logged out" });
  } catch (error) {
    res.status(400).json({ error: "somthing went wrong" });
  }
}
router.route("/toggleDailyLimit").patch(isAuthenticate, toggleDailyLimit);
async function toggleDailyLimit(req, res) {
  try {
    let user = await User.findOne({ _id: req.user._id });
    const limit=user.isDailyLimitSet;
    user = await User.findByIdAndUpdate(
      req.user._id,
      { isDailyLimitSet: !limit },
      { new: true }
    );
    res.status(200).json({ success: true, user:user });
  } catch (error) {
    res.status(400).json({ error: "somthing went wrong" });
  }
}
router.route('/setDailyLimit').patch(isAuthenticate,setDailyLimit)
async function setDailyLimit(req,res){
  try {
    const limit=req.body.limit;
    const user=await User.findByIdAndUpdate(req.user._id,{dailyLimit:limit},{new:true})
    res.status(200).json({user})
  } catch (error) {
    res.status(400).json({error:'somthing went wrong'})
  }
}
router.route('/addFollowing').patch(isAuthenticate,addFollowing)
async function addFollowing(req,res){
  try {
    const id=req.body.user;
    const user= await User.findByIdAndUpdate(req.user._id,{$push:{following:{user:id}}},{new:true}).populate('following.user')
    const user2=await User.findByIdAndUpdate(id,{$push:{followers:{user:req.user._id}}},{new:true})
    res.status(200).json({following:user.following})
  } catch (error) {
    console.log("error",error);
    res.status(400).json({error:'somthing went wrong'})
  }
}
router.route('/removeFollowing').patch(isAuthenticate,removeFollowing)
async function removeFollowing(req,res){
  try {
    const id=req.body.user;
    const user= await User.findByIdAndUpdate(req.user._id,{$pull:{following:{user:id}}},{new:true})
    const user2=await User.findByIdAndUpdate(id,{$pull:{followers:{user:req.user._id}}},{new:true})
    res.status(200).json({following:user.following})
  } catch (error) {
    console.log("error",error);
    res.status(400).json({error:'somthing went wrong'})
  }
}
router.route('/myFollowings').get(isAuthenticate,sendFollowings)
async function sendFollowings(req,res){
  try {
    const user=await User.findOne({_id:req.user._id}).populate('following.user')
    res.status(200).json({followings:user.following})
  } catch (error) {
    res.status(400).json({error:'somthing went wrong'})
  }
}
router.route('/myFollowers').get(isAuthenticate,sendFollowers)
async function sendFollowers(req,res){
  try {
    const user=await User.findOne({_id:req.user._id}).populate('followers.user')
    res.status(200).json({followers:user.followers})
  } catch (error) {
    res.status(400).json({error:'somthing went wrong'})
  }
}

router.route('/userProfile/:id').get(isAuthenticate,sendUserProfile)
async function sendUserProfile(req,res){
  try {
    const user=await User.findById(req.params.id).populate('followers.user following.user').select('-isDailyLimitSet -isPublic -screenTime -dailyLimit')
    res.status(200).json({user})
  } catch (error) {
    log
    res.status(400).json({error:'somthing went wrong'})
  }
}
router.route("/userPosts/:id").get(isAuthenticate, sendUserPosts);
async function sendUserPosts(req, res) {
  try {
    const posts = await Posts.find({ createdBy: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "somthing went wrong" });
  }
}
router.route("/userReels/:id").get(isAuthenticate, sendUserReels);
async function sendUserReels(req, res) {
  try {
    const reels = await Posts.find({
      createdBy: req.params.id,
      postType: "reel",
    }).sort({ createdAt: -1 });
    res.status(200).json({ reels });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "somthing went wrong" });
  }
}

router.route('/searchResult/:keyword').get(isAuthenticate,sendSearchResult)
async function sendSearchResult(req,res){
  try {
    const {keyword}=req.params;
      const result=await User.find({$and:[{_id:{$ne:req.user._id}},{$or:[{name:{$regex:`\\b${keyword}`,$options:'i'}},{username:{$regex:`\\b${keyword}.*`,$options:'i'}}]}]})
      res.status(200).json({result})
  } catch (error) {
    console.log('error');
    res.status(400).json({error:'somthing went wrong'})
  }
}

router.route('/suggestedUser').get(isAuthenticate,sendSuggestedUser)
async function sendSuggestedUser(req,res){
  try {
    const me=await User.findById(req.user._id)
    const {following}=me;
    const ids=following.map((obj)=>obj.user)
    const suggestedUsers=await User.find({_id:{$nin:ids,$ne:req.user._id}})
    res.status(200).json({suggestedUsers})
  } catch (error) {
    res.status(400).json({error:'somthing went wrong'})
  }
}

module.exports = router;
