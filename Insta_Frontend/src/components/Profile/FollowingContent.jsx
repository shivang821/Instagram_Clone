// import React from 'react'
import { useEffect, useState } from "react";
import "./followingContent.css";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { set_followings } from "../../reducers/userReducer";
import axios from "axios";
import FollowingCard from "./FollowingCard";

const FollowingContent = ({ flag }) => {
  const { Followings } = useSelector((state) => state.User);
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
              {/* <FollowingCard item={item} i={.1*(i+1)} key={i + 1} flag={flag} />
              <FollowingCard item={item} i={.1*(i+2)} key={i + 1} flag={flag} />
              <FollowingCard item={item} i={.1*(i+3)} key={i + 1} flag={flag} />
              <FollowingCard item={item} i={.1*(i+4)} key={i} flag={flag} />
              <FollowingCard item={item} i={.1*(i+5)} key={i + 1} flag={flag} />
              <FollowingCard item={item} i={.1*(i+6)} key={i + 1} flag={flag} />
              <FollowingCard item={item} i={.1*(i+7)} key={i + 1} flag={flag} /> */}
            </>
          );
        })
      ) : (
        <div className="followingLoadingDiv">Loading...</div>
      )}
    </div>
  );
};

FollowingContent.propTypes = {
  flag: propTypes.bool,
};
export default FollowingContent;
