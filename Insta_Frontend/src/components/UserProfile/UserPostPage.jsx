import "../Profile/postPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import PostCard from "../Profile/PostCard.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ReactComponent as CancelIcon } from "../profile/assets/crossImage.svg";
import { ReactComponent as ArrowIcon } from "../profile/assets/arrowImage.svg";
import { ReactComponent as MuteIcon } from "../CreateModal/assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "../CreateModal/assets/unMuteIcon.svg";
import { userPosts_success } from "../../reducers/UserProfileReducer.js";
import { motion } from "framer-motion";
import Post from "../Home/Post.jsx";
const PostPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const player = useRef();
  const { userPosts } = useSelector((state) => state.UserProfile);
  const [ind, setInd] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [mute, setMute] = useState(false);
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const handleMute = () => {
    setMute(!mute);
  };
  useEffect(() => {
    if (currentPost) {
      setCurrentPost(userPosts[ind]);
    }
  }, [ind]);
  useEffect(() => {
    const getPosts = async () => {
      const { data } = await axios.get(`/api/userPosts/${id}`);
      dispatch(userPosts_success(data.posts));
    };
    if (userPosts.length === 0) {
      getPosts();
      localStorage.setItem("currentUser", id);
    }
    return () => {
      localStorage.setItem("currentUser", null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (player.current) {
    player.current.currentTime = 10;
    console.log(player.current.currentTime);
  }
  const forward = () => {
    if (ind < userPosts.length - 1) {
      setInd((pre) => pre + 1);
    }
  };
  const backward = () => {
    if (ind > 0) {
      setInd((pre) => pre - 1);
    }
  };
  const increaseInd = () => {
    if (index < currentPost.posts.length - 1) {
      setIndex((prev) => {
        return prev + 1;
      });
    }
  };
  const decreaseInd = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };
  //   useEffect(() => {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting) {
  //           if (!loading && hasMorePosts) {
  //             setPage((prev) => prev + 1);
  //             dispatch(getReels({ page: page + 1, limit: 5 }));
  //           }
  //         }
  //       },
  //       { threshold: .8 }
  //     );
  //     if (ref.current.children[reels.length - 1]) {
  //       observer.observe(ref.current.children[reels.length - 1]);
  //     }
  //     return () => {
  //       if (ref.current&&ref.current.children[reels.length - 1]) {
  //         observer.unobserve(ref.current.children[reels.length - 1]);
  //       }
  //     };
  //   }, [ref, reels.length, loading,hasMore,page,dispatch],device);
  return (
    <div className="myPosts">
      {userPosts.map((item, i) => {
        return (
          <div
            key={i}
            onClick={() => {
              setCurrentPost(item);
              setInd(i);
            }}
            className="postCardParent"
          >
            <PostCard item={item} key={i} />
          </div>
        );
      })}
      {currentPost !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{
            ease: "ease",
            duration: 0.3,
          }}
          className="reelModal postModal"
        >
          {currentPost.postType === "reel" ? (
            <div
              className="reelComponentdiv"
              ref={videoRef}
              style={{ height: "auto", width: "auto" }}
              onClick={() => handleMute(!mute)}
            >
              <div className="reel reelVid">
                <video
                  className="reelVideo"
                  src={currentPost.posts[0].url}
                  loop
                  autoPlay
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noplaybackrate"
                  muted={mute}
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
                {/* <div className="gradientDiv"></div> */}
              </div>
            </div>
          ) : (
            <div className="postModal1">
              <Post
                item={currentPost.posts[index]}
                mute={mute}
                handleMute={handleMute}
              />
              <div className="postModal11">
                {index !== 0 && <ArrowIcon onClick={decreaseInd} />}
              </div>
              <div className="postModal12">
                {index < currentPost.posts.length - 1 && (
                  <ArrowIcon onClick={increaseInd} />
                )}
              </div>
            </div>
          )}

          <CancelIcon
            className="cancelDiv"
            onClick={() => {
              setCurrentPost(null);
              setIndex(0)
            }}
          />
          {ind < userPosts.length - 1 && (
            <ArrowIcon className="forward" onClick={forward} />
          )}
          {ind > 0 && <ArrowIcon className="backward" onClick={backward} />}
        </motion.div>
      )}
    </div>
  );
};

export default PostPage;
