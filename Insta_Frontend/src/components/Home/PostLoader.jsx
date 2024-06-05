import "./postLoader.css";
import { ReactComponent as HeartIcon } from "../Reels/assets/heartIcon.svg";
const PostLoader = () => {
  return (
    <div className="postCard postCardLoader">
      <div className="postCard1 postCardLoader1">
        <div className="postCard11 postCardLoader11">
          <div className="imgDiv"></div>
          <div className="userNameDiv">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="postCard2 postCardLoader2">
        <div></div>
      </div>
      <div className="postCard3 postCardLoader3">
        <div className="postCard31 postCardLoader31">
          <div className="postLikeDiv postCardLoader311">
            <HeartIcon />
          </div>
          <p>likes</p>
        </div>
        <p className="postLoaderDesc1"></p>
        <p className="postLoaderDesc2"></p>
      </div>
    </div>
  );
};

export default PostLoader;
