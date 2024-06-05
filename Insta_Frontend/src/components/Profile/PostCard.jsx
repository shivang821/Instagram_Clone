import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {ReactComponent as ManyPostsIcon} from './assets/manyPostsIcon.svg'
import {ReactComponent as ReelIcon} from './assets/reelsIcon2.svg'
const PostCard = ({ item }) => {
  const videoRef = useRef(null);
  console.log(item);
  useEffect(() => {
    const setPoster = async () => {
        if(videoRef.current){
            videoRef.current.pause();
            videoRef.current.currentTime = 5;
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
    <div className="myPosts1">
      {item.postType === "post" ? (
        item.posts[0].fileType==="video"? <video ref={videoRef} autoPlay={true} src={item.posts[0].url}></video>:
        <img src={item.posts[0].url} alt="" />
      ) : (
        <video ref={videoRef} autoPlay={true} src={item.posts[0].url} />
      )}
      {/* <div className="myPosts11"> */}
        {item.posts.length>1?<ManyPostsIcon className="myPosts11"/>:item.postType==='reel'?<ReelIcon className="myPosts11"/>:''}
      {/* </div> */}
    </div>
  );
};
PostCard.propTypes = {
  item: PropTypes.object,
};
export default PostCard;
