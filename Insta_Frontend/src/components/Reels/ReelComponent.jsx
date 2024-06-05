import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { ReactComponent as MuteIcon } from "../CreateModal/assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "../CreateModal/assets/unMuteIcon.svg";
import { ReactComponent as HeartIcon } from "./assets/heartIcon.svg";
import { ReactComponent as CommentIcon } from "../sideBar/instaAssets/commentIcon.svg";
import Profile from "../sideBar/instaAssets/userProfileImage.jpg";
import ProfileImg from "../sideBar/instaAssets/userProfileImage.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleUserFollowing } from "../../reducers/userReducer";
import CommentCard from "./CommentCard";
const ReelComponent = ({ item, mute, handleMute }) => {
  const navigate = useNavigate();
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState();
  const { createdBy } = item;
  const { user } = useSelector((state) => state.User);
  const { device } = useSelector((state) => state.App);
  const [commentsData, setCommentsData] = useState();
  const scrollRef = useRef(null);
  const ref = useRef();
  const ref1 = useRef();
  const likeRef = useRef();
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [play, setPlay] = useState(false);
  const [lineClamp, setLineClamp] = useState(true);
  const [following, setFollowing] = useState(false);
  const dispatch = useDispatch();
  const callbackFun = (entries) => {
    // if (entries[0].isIntersecting) {
    //   setPlay(true);
    // } else {
    //   setPlay(false);
    // }
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
  const callbackFun1 = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play();
        entry.target.style.visibility = "visible";
      } else {
        entry.target.pause();
        entry.target.style.visibility = "hidden";
      }
    });
  };

  useEffect(() => {
    let current = ref.current;
    let current1 = ref1.current;
    const options = {
      threshold: 0.6,
    };
    const observer = new IntersectionObserver(callbackFun, options);
    const observer1 = new IntersectionObserver(callbackFun1, options);
    if (ref1.current) observer1.observe(ref1.current);
    if (ref.current) observer.observe(ref.current);
    if (ref.current) {
      if (play) {
        ref.current.currentTime = 0;
        ref.current.play();
      } else {
        ref.current.pause();
      }
      ref.current.addEventListener("contextmenu", (event) =>
        event.preventDefault()
      );
    }
    if (ref1.current) {
      if (play) {
        ref1.current.currentTime = 0;
        ref1.current.play();
      } else {
        ref1.current.pause();
      }
    }
    return () => {
      if (current) {
        observer.unobserve(current);
        current.removeEventListener("contextmenu", (event) =>
          event.preventDefault()
        );
      }
      if (current1) observer1.unobserve(current1);
    };
  }, [ref, ref1, play]);
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
    if (like === true) {
      setLikes((pre) => pre - 1);
      await axios.patch(`/api/dislike/${item._id}`, config);
    } else {
      setLikes((pre) => pre + 1);
      await axios.patch(`/api/like/${item._id}`, config);
    }
    setLike(!like);
  };
  useEffect(() => {
    if (item.likedBy.includes(user._id)) {
      setLike(true);
    }
    if (item) {
      setLikes(item.likes);
    }
    if (
      user &&
      user.following.find(({ user }) => user === item.createdBy._id)
    ) {
      setFollowing(true);
    }
  }, [item, user]);
  const handleFollowing = async () => {
    if (!following) {
      const { data } = await axios.patch("/api/addFollowing", {
        user: item.createdBy._id,
      });
      dispatch(handleUserFollowing(data.following));
      if (data) {
        setFollowing(true);
      }
    } else {
      const { data } = await axios.patch("/api/removeFollowing", {
        user: item.createdBy._id,
      });
      dispatch(handleUserFollowing(data.following));
      if (data) {
        setFollowing(false);
      }
    }
  };
  const postComment = async () => {
    const myForm = new FormData();
    myForm.set("comment", comment);
    const { data } = await axios.post(`/api/addComment/${item._id}`, {
      comment: comment,
    });
    setCommentsData(data.comments);
  };
  const fetchComments = async () => {
    const { data } = await axios.get(`/api/addComment/${item._id}`);
    setCommentsData(data.comments);
  };
  return (
    <div className="reel" ref={scrollRef}>
      <video
        className="reelVideo"
        src={item ? item.posts[0].url : ""}
        ref={ref}
        loop
        disablePictureInPicture
        controlsList="nodownload nofullscreen noplaybackrate"
        muted={mute}
        onClick={() => {
          openComments ? setOpenComments(false) : handleMute(!mute);
        }}
      ></video>
      {device !== "mob" && localStorage.getItem("ambientMode") === "enable" && (
        <video
          ref={ref1}
          src={item ? item.posts[0].url : ""}
          className="backVideo reelVideo"
          preload="metadata"
          muted
          loop
        ></video>
      )}

      <div className="bottom">
        <div className="bottom1">
          <div className="profileDiv transparent">
            {createdBy && (
              <img
                src={createdBy.profile ? createdBy.profile.url : ProfileImg}
                alt=""
              />
            )}
          </div>
          <div className="text1 transparent bottomText1">
            <p
              onClick={() => {
                item.createdBy._id===user._id?navigate(`/profile`):
                navigate(`/profile/${item.createdBy._id}`);
              }}
            >
              {createdBy.username}
            </p>
          </div>

          {item.createdBy._id !== user._id && (
            <>
              <p>|</p>{" "}
              <p onClick={handleFollowing} style={{color:`${!following?'var(--button)':''}`,transition:'all .3s ease'}}>
                {following ? "Following" : "Follow"}
              </p>
            </>
          )}
        </div>
        <div
          className="text2 transparent"
          onClick={() => setLineClamp(!lineClamp)}
        >
          {/* <p>{item&&item.description?item.description:"_____//_____//_____//_____//__"}</p> */}
          <p className={lineClamp ? "clamp" : "noclamp"}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore,
            harum. Ea rem nesciunt neque tenetur temporibus dicta voluptatibus
            est iste accusamus architecto eum rerum ab, necessitatibus corporis
            voluptates! Libero, suscipit.
          </p>
        </div>
      </div>
      <div className="actionDiv">
        <div className="likeDiv" ref={likeRef}>
          <HeartIcon onClick={() => handleLike()} />
          <p>{likes}</p>
        </div>
        <div className="commentDiv">
          <CommentIcon
            onClick={() => {
              setOpenComments(!openComments);
              fetchComments();
            }}
          />
        </div>
        {!mute ? (
          <UnMuteIcon
            className="unMuteicon "
            onClick={() => handleMute(!mute)}
          />
        ) : (
          <MuteIcon className="muteicon " onClick={() => handleMute(!mute)} />
        )}
      </div>
      <div className="gradientDiv"></div>
      <div className="commentDivParent">
        {openComments && (
          <div
            className={`commentsDiv ${
              openComments ? "showCommentDiv" : "hideCommentDiv"
            }`}
          >
            <div className="commentsDiv1">
              <p>Comments</p>
            </div>
            <div className="commentsDiv2">
              {commentsData && commentsData.comments ? (
                commentsData.comments.map((commentItem, i) => {
                  return <CommentCard comment={commentItem} key={i} />;
                })
              ) : (
                <p style={{textAlign:'center',position:'absolute',top:'45%',left:'31%',color: "var(--text2)", fontWeight: "550" }}>
                  No comments yet
                </p>
              )}
            </div>
            <div className="commentsDiv3">
              <img src={user.profile?user.profile.url:Profile} />
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                style={{ color: `${comment ? "var(--button)" : ""}` }}
                disabled={!comment}
                onClick={postComment}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
ReelComponent.propTypes = {
  item: PropTypes.object,
  ind: PropTypes.number,
  mute: PropTypes.bool,
  handleMute: PropTypes.func,
};
export default ReelComponent;
