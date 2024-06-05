import { useEffect, useRef, useState } from "react";
import { ReactComponent as ReelIcon } from "../Profile/assets/reelsIcon2.svg";
import { ReactComponent as PostIcon } from "../Profile/assets/postsIcon.svg";
import UserPostPage from "./UserPostPage";
import UserReelPage from "./UserReelPage";
import { useDispatch } from "react-redux";
import { reset_user_profile} from "../../reducers/UserProfileReducer";
const UserProfileBottom = () => {
  const posts = useRef(null);
  const [tab, setTab] = useState(localStorage.getItem("tab") || "posts");
  const reels = useRef(null);
  const activeTab = useRef(null);
  const dispatch=useDispatch()
  useEffect(() => {
    if (tab === "posts") {
      if (posts.current && reels.current && activeTab.current) {
        posts.current.classList.add("activeTab");
        reels.current.classList.remove("activeTab");
        activeTab.current.classList.remove("activeTabBorderRight");
      }
    } else {
      if (posts.current && reels.current && activeTab.current) {
        reels.current.classList.add("activeTab");
        posts.current.classList.remove("activeTab");
        activeTab.current.classList.add("activeTabBorderRight");
      }
    }
  }, [tab]);
  useEffect(()=>{
    return(()=>{
        dispatch(reset_user_profile())
    })
  },[])
  return (
    <>
      <div className="profile121">
        <div className="profile1211">
          <div className="activeTabBorder" ref={activeTab}></div>
          <div
            className="profile12111"
            ref={posts}
            onClick={() => {
              setTab("posts");
              localStorage.setItem("tab", "posts");
            }}
          >
            <PostIcon />
            <p>Posts</p>
          </div>
          <div
            className="profile12112"
            ref={reels}
            onClick={() => {
              setTab("reels");
              localStorage.setItem("tab", "reels");
            }}
          >
            <ReelIcon />
            <p>Reels</p>
          </div>
        </div>
      </div>
      <div className="profile122">
        {tab === "posts" ? <UserPostPage /> : <UserReelPage />}
      </div>
    </>
  );
};

export default UserProfileBottom;
