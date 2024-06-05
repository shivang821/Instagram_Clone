// import React from 'react'
import { useEffect, useState } from "react";
import "../Profile/followingContent.css";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { set_followings } from "../../reducers/userReducer";
import axios from "axios";
import FollowingCard from "../Profile/FollowingCard";

const UserFollowingContent = ({ flag }) => {
  const {following:Followings } = useSelector((state) => state.UserProfile.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function callFollowings() {
      const { data } = await axios.get("/api/myFollowings");
      dispatch(set_followings(data.followings));
      setLoading(false);
    }
    callFollowings();
  }, []);

  return (
    <div className="followingContent">
      {!loading ? (
        Followings.map((item, i) => {
          return (
            <>
              <FollowingCard item={item} i={i*0.1} key={i} flag={flag} />
            </>
          );
        })
      ) : (
        <div className="followingLoadingDiv">Loading...</div>
      )}
    </div>
  );
};

UserFollowingContent.propTypes = {
  flag: propTypes.bool,
};
export default UserFollowingContent;
