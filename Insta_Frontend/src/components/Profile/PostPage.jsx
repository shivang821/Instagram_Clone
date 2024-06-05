import "./postPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getMyPosts } from "../../actions/userActions.js";
import PostCard from "./PostCard.jsx";
import { motion } from "framer-motion";
import { ReactComponent as CancelIcon } from './assets/crossImage.svg';
import { ReactComponent as ArrowIcon } from "./assets/arrowImage.svg";
import { ReactComponent as MuteIcon } from "../CreateModal/assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "../CreateModal/assets/unMuteIcon.svg";
import Post from "../Home/Post.jsx";
const PostPage = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);
  const player = useRef();
  const { myPosts } = useSelector((state) => state.User);
  const [ind, setInd] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [mute, setMute] = useState(false);
  const handleMute = () => {
    setMute(!mute);
  };
  useEffect(() => {
    if (myPosts.length === 0) {
      dispatch(getMyPosts());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (player.current) {
    player.current.currentTime = 10;
    console.log(player.current.currentTime);
  }
  useEffect(() => {
    if (currentPost) {
      setCurrentPost(myPosts[ind]);
    }
  }, [ind]);
  const forward = () => {
    if (ind < myPosts.length - 1) {
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
      {myPosts.map((item, i) => {
        return (
          <div
            key={i}
            onClick={() => {
              setCurrentPost(item);
              setInd(i);
            }}
            className="postCardParent"
          >
            <PostCard item={item} />
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
          {ind < myPosts.length - 1 && (
            <ArrowIcon className="forward" onClick={forward} />
          )}
          {ind > 0 && <ArrowIcon className="backward" onClick={backward} />}
        </motion.div>
      )}
    </div>
  );
};

export default PostPage;
