// import React from 'react'
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUserFollowing, set_followings } from "../../reducers/userReducer";
import { motion } from "framer-motion";
import ProfileImg from "../sideBar/instaAssets/userProfileImage.jpg";
const FollowerCard = ({ item, i, flag }) => {
  const { Followings } = useSelector((state) => state.User);
  const [following, setFollowing] = useState(Followings.find(({ user }) => user._id === item.user._id)?true:false);
  const dispatch = useDispatch();
  const {user}=useSelector(state=>state.User)
  const handleFollowing = async () => {
    if (!following) {
      const { data } = await axios.patch("/api/addFollowing", {
        user: item.user._id,
      });
      dispatch(handleUserFollowing(data.following));
      dispatch(set_followings(data.following))
      if (data) {
        setFollowing(true);
      }
    } else {
      const { data } = await axios.patch("/api/removeFollowing", {
        user: item.user._id,
      });
      dispatch(handleUserFollowing(data.following));
      dispatch(set_followings(data.following))
      if (data) {
        setFollowing(false);
      }
    }
  };
  const animationVariants = {
    hidden: { opacity: 0, y: "-3.5rem" },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  };
  return (
    <>
      <motion.div
        className="followerCard"
        initial="hidden"
        animate={flag ? "visible" : "hidden"}
        exit="exit"
        variants={animationVariants}
        transition={
          flag
            ? {
                ease: "linear",
                duration: 0.2,
                delay: i + 0.4,
              }
            : {
                duration: 0.3,
                delay: 0.1,
              }
        }
      >
        <div className="followerCard1">
          <img src={item.user.profile?item.user.profile.url:ProfileImg} alt="" />
        </div>
        <div className="followerCard2">
          <p>{item.user.username}</p>
          <p>{item.user.name}</p>
        </div>
        <div className="followerCard3">
          <button
            onClick={handleFollowing}
            disabled={item.user._id===user._id}
            className={`${item.user._id===user._id?"":!following ? "blueButton" : ""}`}
          >
            {item.user._id===user._id?"You":following ? "Following.." : "Follow.."}
          </button>
        </div>
      </motion.div>
    </>
  );
};
FollowerCard.propTypes = {
  item: PropTypes.object,
  i: PropTypes.number,
  flag: PropTypes.bool,
};
export default FollowerCard;
