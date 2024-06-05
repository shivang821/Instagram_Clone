// import React from 'react'
import "./userProfile.css";
import { motion } from "framer-motion";
import ProfileImg from "../sideBar/instaAssets/userProfileImage.jpg";
import { ReactComponent as Cancel } from "../Profile/assets/crossImage.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { loadUserProfile } from "../../reducers/UserProfileReducer";
import UserFollowingContent from "./UserFollowingContent";
import UserFollowerContent from "./UserFollowerContent";
import UserProfileBottom from "./UserProfilebottom";
const UserProfile = () => {
  const { id } = useParams();
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: mySelf } = useSelector((state) => state.User);
  const [following, setFollowing] = useState(false);
  const { user } = useSelector((state) => state.UserProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref3.current && !ref3.current.contains(e.target)) {
        setOpenFollowingModal(false);
      }
      if (ref4.current && !ref4.current.contains(e.target)) {
        setOpenFollowerModal(false);
      }
    }
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  useEffect(() => {
    if (openFollowingModal) {
      if (ref3.current) {
        ref3.current.classList.add("openClass");
        ref3.current.classList.remove("closeClass");
      }
    } else {
      if (ref3.current) {
        ref3.current.classList.remove("openClass");
        ref3.current.classList.add("closeClass");
      }
    }
    if (openFollowerModal) {
      if (ref4.current) {
        ref4.current.classList.add("openClass");
        ref4.current.classList.remove("closeClass");
      }
    } else {
      if (ref4.current) {
        ref4.current.classList.remove("openClass");
        ref4.current.classList.add("closeClass");
      }
    }
  }, [openFollowingModal, openFollowerModal, loading]);
  useEffect(() => {
    const callUser = async () => {
      const { data } = await axios.get(`/api/userProfile/${id}`);
      dispatch(loadUserProfile(data.user));
      setLoading(false);
    };
    callUser();
    if (
      mySelf &&
      mySelf.following.find(({ user }) => user._id === user._id)
    ) {
      setFollowing(true);
    }
  }, []);

  return (
    <div className="userProfile">
      {loading ? (
        <div className="userProfile">
          <h2>Loading...</h2>
        </div>
      ) : (
        <motion.div
          className="userProfile1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{
            ease: "linear",
            duration: 0.5,
          }}
        >
          <div className="userProfile11">
            <div className="userProfile111">
              <img
                src={user && user.profile ? user.profile.url : ProfileImg}
                alt=""
              />
            </div>
            <div className="userProfile112">
              <div className="userName">
                <h3>{user && user.username}</h3>
                <div className="userName1">
                  <button>{following?'Following':'Follow'}</button>
                  {/* <button>Message</button> */}
                </div>
              </div>
              <h4>{user && user.name}</h4>
              <h4>{user && user.email}</h4>
            </div>
            <div className="userProfile113">
              <h4>{user && user.numberOfPosts} Posts</h4>
              <button
                disabled={openFollowingModal || openFollowerModal}
                onClick={() => setOpenFollowerModal(true)}
              >
                <h4> {user && user.followers.length} Followers</h4>
              </button>
              <button
                disabled={openFollowingModal || openFollowerModal}
                onClick={() => {
                  setOpenFollowingModal(true);
                }}
              >
                <h4> {user && user.following.length} Following</h4>
              </button>
            </div>
          </div>
          <div className="userProfile12">
            <UserProfileBottom />
          </div>
          <div ref={ref3} className="sideModal">
            <div
              className="closeIcon"
              onClick={() => setOpenFollowingModal(false)}
            >
              <Cancel />
            </div>
            <div className="sideModal1">
              <p>Following</p>
            </div>
            <div className="sideModal2">
              <UserFollowingContent flag={openFollowingModal} />
            </div>
          </div>
          <div ref={ref4} className="sideModal">
            <div
              className="closeIcon"
              onClick={() => setOpenFollowerModal(false)}
            >
              <Cancel />
            </div>
            <div className="sideModal1">
              <p>Followers</p>
            </div>
            <div className="sideModal2">
              <UserFollowerContent flag={openFollowerModal} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
