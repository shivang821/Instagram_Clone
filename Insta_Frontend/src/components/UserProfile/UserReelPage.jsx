import "../Profile/reelPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as CancelIcon } from "../Profile/assets/crossImage.svg";
import { ReactComponent as ArrowIcon } from "../Profile/assets/arrowImage.svg";
import ReelCard from "../Profile/ReelCard.jsx";
import { motion } from "framer-motion";
// import ReelComponent from "../Reels/ReelComponent.jsx";
import { ReactComponent as MuteIcon } from "../CreateModal/assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "../CreateModal/assets/unMuteIcon.svg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { userReels_success } from "../../reducers/UserProfileReducer.js";
const UserReelPage = () => {
  const dispatch = useDispatch();
  const [mute, setMute] = useState(true);
  const [currentReel, setCurrentReel] = useState(null);
  const [ind, setInd] = useState(null);
  const videoRef = useRef(null);
  const left = useRef(null);
  const right = useRef(null);
  const player = useRef();
  const { userReels } = useSelector((state) => state.UserProfile);
  const { id } = useParams();
  
  useEffect(() => {
    const getReels = async () => {
      const { data } = await axios.get(`/api/userReels/${id}`);
      dispatch(userReels_success(data.reels));
    };
    if(userReels.length===0){
        getReels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (player.current) {
    player.current.currentTime = 10;
  }
  const handleMute = (muteValue) => {
    setMute(muteValue);
  };

  useEffect(() => {
    if (currentReel) {
      setCurrentReel(userReels[ind]);
    }
  }, [ind]);
  const forward = () => {
    if (ind < userReels.length - 1) {
      setInd((pre) => pre + 1);
    }
  };
  const backward = () => {
    if (ind > 0) {
      setInd((pre) => pre - 1);
    }
  };
  //   const setCurrentReelFunc=(item)=>{
  //     setCurrentReel
  //   }
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
    <div className="myReels">
      {userReels.map((item, i) => {
        return (
          <div
            key={i}
            className="myReelsDiv"
            onClick={() => {
              setCurrentReel(item);
              setInd(i);
            }}
          >
            <ReelCard item={item} />
          </div>
        );
      })}
      {currentReel !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{
            ease: "ease",
            duration: 0.3,
          }}
          className="reelModal"
        >
          <div
            className="reelComponentdiv"
            ref={videoRef}
            style={{ height: "auto", width: "auto" }}
            onClick={() => handleMute(!mute)}
          >
            <div className="reel reelVid">
              <video
                className="reelVideo"
                src={currentReel.posts[0].url}
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
          <CancelIcon
            className="cancelDiv"
            onClick={() => {
              setCurrentReel(null);
            }}
          />
          <ArrowIcon
            ref={right}
            style={{
              display: `${ind === userReels.length - 1 ? "none" : "block"}`,
            }}
            className="forward"
            onClick={forward}
          />
          <ArrowIcon
            ref={left}
            style={{ display: `${ind === 0 ? "none" : "block"}` }}
            className="backward"
            onClick={backward}
          />
        </motion.div>
      )}
    </div>
  );
};

export default UserReelPage;
