// import React from 'react'
import { useEffect, useState } from "react";
import "./followerContent.css";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { set_followers } from "../../reducers/userReducer";
import axios from "axios";
import FollowerCard from "./FollowerCard.jsx";

const FollowerContent = ({ flag }) => {
  const { Followers} = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function callFollowers() {
      const { data } = await axios.get("/api/myFollowers");
      dispatch(set_followers(data.followers));
      setLoading(false);
    }
    callFollowers();
  }, []);

  return (
    <div className="followerContent">
      {!loading ? (
        Followers.map((item, i) => {
          return (
            <>
              <FollowerCard item={item} i={i*0.1} key={i} flag={flag} />
            </>
          );
        })
      ) : (
        <div className="followingLoadingDiv">Loading...</div>
      )}
    </div>
  );
};

FollowerContent.PropTypes = {
  flag: PropTypes.bool,
};
export default FollowerContent;
