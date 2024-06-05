import PropTypes from "prop-types";
import "./postCard.css";
import { ReactComponent as HeartIcon } from "../Reels/assets/heartIcon.svg";
import { ReactComponent as ArrowIcon } from "../Profile/assets/arrowImage.svg";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as MuteIcon } from "../CreateModal/assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "../CreateModal/assets/unMuteIcon.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleUserFollowing,
  suggestedUsers_success,
} from "../../reducers/userReducer";
import Post from "./Post";
const SuggestedPostCard = ({ post, mute, handleMute }) => {
  const likeRef = useRef();
  const navigate = useNavigate();
  const ref = useRef();
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [lineClamp, setLineClamp] = useState(true);
  const { user } = useSelector((state) => state.User);
  const [following, setFollowing] = useState(false);
  const [play, setPlay] = useState(false);
  const [suggestedUserLoading, setSuggestedUserLoading] = useState(false);
  const { device } = useSelector((state) => state.App);
  const dispatch = useDispatch();
  var todayDate = Date.parse(new Date().toISOString());
  let diff = todayDate - Date.parse(post.createdAt);
  const [ind, setInd] = useState(0);
  const year = Math.floor(diff / (1000 * 60 * 60 * 24 * 30 * 12));
  const month = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hour = Math.floor(diff / (1000 * 60 * 60));
  const minute = Math.floor(diff / (1000 * 60));
  const sec = Math.floor(diff / 1000);
  const timesAgo =
    year > 0
      ? `${year} yr`
      : month > 0
      ? `${month} mo`
      : week > 0
      ? `${week} wk`
      : day > 0
      ? `${day} d`
      : hour > 0
      ? `${hour} hr`
      : minute > 0
      ? `${minute} min`
      : `${sec} sec`;
  useEffect(() => {}, [device]);
  useEffect(() => {
    if (like) {
      if (likeRef.current) {
        likeRef.current.classList.add("like");
      }
    } else {
      if (likeRef.current) {
        likeRef.current.classList.remove("like");
      }
    }
  }, [like]);
  const handleLike = async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    if (like === true && likes > 0) {
      setLikes((pre) => pre - 1);
      await axios.patch(`/api/dislike/${post._id}`, config);
    } else {
      setLikes((pre) => pre + 1);
      await axios.patch(`/api/like/${post._id}`, config);
    }
    setLike(!like);
  };
  useEffect(() => {
    if (post.likedBy.includes(user._id)) {
      setLike(true);
    }
    if (post) {
      setLikes(post.likes);
    }
    if (
      user &&
      user.following.find(({ user }) => user === post.createdBy._id)
    ) {
      setFollowing(true);
    }
  }, [post, user]);
  const callbackFun = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setPlay(true);
        entry.target.mute = false;
        entry.target.autoPlay = true;
      } else {
        setPlay(false);
        entry.target.autoPlay = false;
        entry.target.mute = true;
        entry.target.mute = true;
      }
    });
  };
  useEffect(() => {
    let current = ref.current;
    const options = {
      threshold: 0.9,
    };
    const observer = new IntersectionObserver(callbackFun, options);
    if (ref.current) observer.observe(ref.current);
    if (ref.current) {
      if (play) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
      ref.current.addEventListener("contextmenu", (event) =>
        event.preventDefault()
      );
    }

    return () => {
      if (current) {
        observer.unobserve(current);
        current.removeEventListener("contextmenu", (event) =>
          event.preventDefault()
        );
      }
    };
  }, [ref, play]);
  const increaseInd = () => {
    if (ind < post.posts.length - 1) {
      setInd((prev) => {
        return prev + 1;
      });
    }
  };
  const decreaseInd = () => {
    if (ind > 0) {
      setInd((prev) => prev - 1);
    }
  };
  const handleFollowing = async () => {
    if (!following) {
      const { data } = await axios.patch("/api/addFollowing", {
        user: post.createdBy._id,
      });
      dispatch(handleUserFollowing(data.following));
      if (data) {
        setFollowing(true);
      }
    } else {
      const { data } = await axios.patch("/api/removeFollowing", {
        user: post.createdBy._id,
      });
      dispatch(handleUserFollowing(data.following));
      if (data) {
        setFollowing(false);
      }
    }
    const fetchSuggestedUser = async () => {
      setSuggestedUserLoading(true);
      const { data } = await axios.get("/api/suggestedUser");
      dispatch(suggestedUsers_success(data.suggestedUsers));
      setTimeout(() => {
        setSuggestedUserLoading(false);
      }, [1500]);
    };
    fetchSuggestedUser();
  };
  return (
    <div className="postCard">
      <div className="postCard1">
        <div className="postCard11">
          <img src={post.createdBy.profile.url} alt="" />
          <p>
            <span
              onClick={() => {
                post.createdBy._id===user._id?navigate(`/profile`):
                navigate(`/profile/${post.createdBy._id}`);
              }}
            >
              {post.createdBy.username}{" "}
            </span>
            <br /> <span>{timesAgo} ago</span>{" "}
          </p>
          {user._id !== post.createdBy._id && (
            <div className="followingDiv">
              <p onClick={handleFollowing}>
                {following ? (
                  <span className="following">Following...</span>
                ) : (
                  <span className="notFollowing">Follow</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="postCard2">
        {post.postType === "reel" ? (
          <>
            <video
              src={post.posts[0].url}
              ref={ref}
              loop
              disablePictureInPicture
              controlsList="nodownload nofullscreen noplaybackrate"
              muted={mute}
              onClick={() => handleMute(!mute)}
            ></video>
            <div className="actionDiv">
              {!mute ? (
                <UnMuteIcon
                  className="unMuteicon "
                  onClick={() => handleMute(!mute)}
                />
              ) : (
                <MuteIcon
                  className="muteicon "
                  onClick={() => handleMute(!mute)}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <Post item={post.posts[ind]} mute={mute} handleMute={handleMute} />
          </>
        )}
        {post.postType == "post" &&
          post.posts.length > 1 &&
          ind < post.posts.length - 1 && (
            <div className="rightArrow">
              <ArrowIcon onClick={increaseInd} />
            </div>
          )}
        {post.postType == "post" && ind > 0 && (
          <div className="leftArrow">
            <ArrowIcon onClick={decreaseInd} />
          </div>
        )}
        {post.postType == "post" && post.posts.length > 1 && (
          <div className="indicesCircle">
            {post.posts.map((item, i) => {
              return (
                <div
                  className="circles"
                  onClick={() => {
                    setInd(i);
                  }}
                  style={{
                    backgroundColor: `${ind == i ? "white" : "transparent"}`,
                  }}
                  key={i}
                ></div>
              );
            })}
          </div>
        )}
      </div>
      <div className="postCard3">
        <div className="postCard31">
          <div className="postLikeDiv" ref={likeRef}>
            <HeartIcon onClick={() => handleLike()} />
          </div>
          <p>{likes} likes</p>
        </div>
        <p
          onClick={() => setLineClamp(!lineClamp)}
          className={
            lineClamp ? "clamp postCard3Desc" : "noclamp postCard3Desc"
          }
        >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore,
          harum. Ea rem nesciunt neque tenetur temporibus dicta voluptatibus est
          iste accusamus architecto eum rerum ab, necessitatibus corporis
          voluptates! Libero, suscipit.
        </p>
      </div>
    </div>
  );
};
SuggestedPostCard.propTypes = {
  post: PropTypes.object,
  mute: PropTypes.bool,
  handleMute: PropTypes.func,
};
export default SuggestedPostCard;
