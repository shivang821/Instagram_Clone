import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {ReactComponent as ReelIcon} from './assets/reelsIcon2.svg'
const ReelCard = ({ item }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    const setPoster = async () => {
        if(videoRef.current){
            videoRef.current.pause();
            videoRef.current.currentTime = 1;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const posterDataURL = canvas.toDataURL();
            videoRef.current.poster = posterDataURL;
        }
    };
    setPoster();
  }, []);
  return (
    <div className="myReels1">
        <video ref={videoRef} autoPlay src={item.posts[0].url} />
        <ReelIcon className="myReels11"/>
    </div>
  );
};
ReelCard.propTypes = {
  item: PropTypes.object,
};
export default ReelCard;
