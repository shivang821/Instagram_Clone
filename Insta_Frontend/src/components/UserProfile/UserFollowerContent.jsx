
import { useEffect, useState } from "react";
import "../Profile//followerContent.css";
import propTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { set_followers } from "../../reducers/userReducer.js";
import axios from "axios";
import FollowerCard from "../Profile/FollowerCard.jsx";

const UserFollowerContent = ({ flag }) => {
  const {followers:Followers} = useSelector((state) => state.UserProfile.user);
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

UserFollowerContent.propTypes = {
  flag: propTypes.bool.isRequired,
};
export default UserFollowerContent;
