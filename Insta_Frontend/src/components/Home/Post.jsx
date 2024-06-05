// import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as MuteIcon } from "../CreateModal/assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "../CreateModal/assets/unMuteIcon.svg";
import { useEffect, useRef, useState } from "react";
const Post = ({ item, mute, handleMute }) => {
  const [play, setPlay] = useState(false);
  const ref = useRef();
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
  }, [ref, play, item]);
  //   useEffect(()=>{},[])
  return (
    <>
      {item.fileType === "image" ? (
        <img src={item.url} alt="" />
      ) : (
        <>
          <video
            src={item.url}
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
      )}
    </>
  );
};
Post.propTypes = {
  item: PropTypes.object,
  mute: PropTypes.bool,
  handleMute: PropTypes.func,
};
export default Post;
