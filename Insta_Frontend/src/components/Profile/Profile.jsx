// import React from 'react'
import "./profile.css";
import { motion } from "framer-motion";
import ProfileImg from "../sideBar/instaAssets/userProfileImage.jpg";
import { ReactComponent as Cancel } from "./assets/crossImage.svg";
import { ReactComponent as Logout } from "./assets/logoutIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { updateUser } from "../../actions/userActions";
import { useLocation } from "react-router-dom";
import { SET_DARKMODE } from "../../reducers/appReducer";
import ProfileBottom from "./ProfileBottom";
import axios from "axios";
import {
  loadUser,
  logout_user,
} from "../../reducers/userReducer";
import FollowingContent from "./FollowingContent";
import FollowerContent from "./FollowerContent";

// const PostPage=React.lazy(()=>import('./PostPage'))
const Profile = () => {
  const location = useLocation();
  const { darkmode } = useSelector((state) => state.App);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [opneLimitDiv, setOpenLimitDiv] = useState(false);
  const { user } = useSelector((state) => state.User);
  const [profile, setProfile] = useState([]);
  const [profileView, setProfileView] = useState("");
  const [dailyLimit, setDailyLimit] = useState(user.dailyLimit || 0);
  const dispatch = useDispatch();
  const { screenTime } = useSelector((state) => state.User);
  // const [scTime,setScTime]=useState(user?user.screenTime:0);
  // useMemo(()=>{setScTime(user.screenTime)},[user.screenTime])
  const [darkMode, setDarkMode] = useState(
    darkmode === "disable" ? false : true
  );
  const [ambientMode, setAmbientMode] = useState(
    localStorage.getItem("ambientMode") === "disable" ? false : true
  );
  const [isDailtLimitSet, setIsDailyLimitSet] = useState(
    user.isDailyLimitSet || false
  );
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref1.current && !ref1.current.contains(e.target)) {
        setOpenEditModal(false);
      }
      if (ref2.current && !ref2.current.contains(e.target)) {
        setOpenSettingModal(false);
      }
      if (ref3.current && !ref3.current.contains(e.target)) {
        setOpenFollowingModal(false);
      }
      if (ref4.current && !ref4.current.contains(e.target)) {
        setOpenFollowerModal(false);
      }
    }
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  const handleProfile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfileView(reader.result);
    };
    reader.readAsDataURL(file);
    setProfile(() => {
      return [file];
    });
  };
  const handleUpload = () => {
    const myForm = new FormData();
    profile.forEach((file) => {
      myForm.append("files", file);
    });
    dispatch(updateUser(myForm));
  };
  useEffect(() => {
    if (openEditModal) {
      if (ref1.current) {
        ref1.current.classList.add("openClass");
        ref1.current.classList.remove("closeClass");
      }
    } else {
      if (ref1.current) {
        ref1.current.classList.remove("openClass");
        ref1.current.classList.add("closeClass");
      }
    }
    if (openSettingModal) {
      if (ref2.current) {
        ref2.current.classList.add("openClass");
        ref2.current.classList.remove("closeClass");
      }
    } else {
      if (ref2.current) {
        ref2.current.classList.remove("openClass");
        ref2.current.classList.add("closeClass");
      }
    }
    if (openFollowingModal) {
      if (ref3.current) {
        ref3.current.classList.add("openClass");
        ref3.current.classList.remove("closeClass");
      }
    } else {
      if (ref3.current) {
        ref3.current.classList.remove("openClass");
        ref3.current.classList.add("closeClass");
      }
    }
    if (openFollowerModal) {
      if (ref4.current) {
        ref4.current.classList.add("openClass");
        ref4.current.classList.remove("closeClass");
      }
    } else {
      if (ref4.current) {
        ref4.current.classList.remove("openClass");
        ref4.current.classList.add("closeClass");
      }
    }
  }, [openEditModal, openSettingModal, openFollowingModal,openFollowerModal]);

  const handleDarkMode = () => {
    if (darkMode === false) {
      dispatch(SET_DARKMODE("enable"));
      localStorage.setItem("darkmode", "enable");
    } else {
      dispatch(SET_DARKMODE("disable"));
      localStorage.setItem("darkmode", "disable");
    }
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    if (darkMode === true) {
      document.body.classList.add("darkmode");
    } else {
      document.body.classList.remove("darkmode");
    }
  }, [darkMode]);
  const handleAmbientMode = () => {
    if (ambientMode === true) {
      localStorage.setItem("ambientMode", "disable");
    } else {
      localStorage.setItem("ambientMode", "enable");
    }
    setAmbientMode(!ambientMode);
  };
  const handleDailyLimit = async () => {
    setOpenLimitDiv(false);
    const { data } = await axios.patch("/api/toggleDailyLimit");
    dispatch(loadUser(data.user));
    setIsDailyLimitSet(!isDailtLimitSet);
  };
  const logoutUser = () => {
    axios.get("/api/logout");
    dispatch(logout_user());
  };
  const updateDailyLimit = async () => {
    const { data } = await axios.patch("/api/setDailyLimit", {
      limit: dailyLimit,
    });
    dispatch(loadUser(data.user));
  };
  return (
    <div className="profile">
      <motion.div
        className="profile1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.5 }}
        transition={{
          ease: "linear",
          duration: 0.5,
        }}
      >
        <div className="profile11">
          <div className="profile111">
            <img src={user.profile ? user.profile.url : ProfileImg} alt="" />
          </div>
          <div className="profile112">
            <div className="userName">
              <h3>{user.username}</h3>
              {location.pathname === "/profile" && (
                <div className="userName1">
                  <button
                    onClick={() => setOpenEditModal(true)}
                    disabled={
                      openSettingModal || openSettingModal || openFollowingModal||openFollowerModal
                    }
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={() => setOpenSettingModal(true)} 
                    disabled={
                      openEditModal || openSettingModal || openFollowingModal||openFollowerModal
                    }
                  >
                    Settings
                  </button>
                </div>
              )}
              {location.pathname !== "/profile" && (
                <div className="userName1">
                  <button>Follow</button>
                  <button>Message</button>
                </div>
              )}
            </div>
            <h4>{user.name}</h4>
            <h4>{user.email}</h4>
          </div>
          <div className="profile113">
            <h4>{user.numberOfPosts} Posts</h4>
            <button
              disabled={openEditModal || openSettingModal || openFollowingModal||openFollowerModal}
              onClick={()=>setOpenFollowerModal(true)}
            >
              <h4> {user.followers.length} Followers</h4>
            </button>
            <button
              disabled={openEditModal || openSettingModal || openFollowingModal||openFollowerModal}
              onClick={() => {
                setOpenFollowingModal(true);
              }}
            >
              <h4> {user.following.length} Following</h4>
            </button>
          </div>
        </div>
        <div className="profile12">
          <ProfileBottom />
        </div>
        <div ref={ref1} className="sideModal">
          <div className="closeIcon" onClick={() => setOpenEditModal(false)}>
            <Cancel />
          </div>
          <div className="sideModal1">
            <p>Edit profile</p>
          </div>
          <div className="sideModal2">
            <img
              src={
                profileView
                  ? profileView
                  : user.profile
                  ? user.profile.url
                  : ProfileImg
              }
              alt=""
            />
            {!profileView && (
              <button>
                <label htmlFor="postInp">Select</label>
                <input
                  name="files"
                  type="file"
                  style={{ visibility: "hidden" }}
                  accept="image/png,image/jpg,image/jpeg"
                  id="postInp"
                  onChange={handleProfile}
                />
              </button>
            )}
            {profileView && <button onClick={handleUpload}>Upload</button>}
          </div>
        </div>
        <div ref={ref2} className="sideModal">
          <div className="closeIcon" onClick={() => setOpenSettingModal(false)}>
            <Cancel />
          </div>
          <div className="sideModal1">
            <p>Settings</p>
          </div>
          <div className="sideModal2 settingDiv">
            <div className="settingItem">
              <div className="settingItem1">
                <p>Dark mode</p>
              </div>
              <div className="settingItem2">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={darkmode === "enable" ? true : false}
                    onChange={() => {
                      handleDarkMode();
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <div className="settingItem">
              <div className="settingItem1">
                <p>Ambient Mode</p>
              </div>
              <div className="settingItem2">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={ambientMode}
                    onChange={() => {
                      handleAmbientMode();
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <div className="settingItem">
              <div className="dailyLimit1">
                <div className="settingItem1">
                  <p>Daily limit</p>
                </div>
                <div className="settingItem2">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isDailtLimitSet}
                      onChange={() => {
                        handleDailyLimit();
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              <div className={`${isDailtLimitSet ? "dailyLimit2" : ""}`}>
                <p>
                  <span onClick={() => setOpenLimitDiv(!opneLimitDiv)}>
                    {" "}
                    Set daily limit
                  </span>
                  <span>{screenTime + "/" + user.dailyLimit} Min</span>
                </p>
                <div className={`${opneLimitDiv ? "dailyLimit21" : ""}`}>
                  {isDailtLimitSet && opneLimitDiv && (
                    <>
                      <input
                        type="number"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(e.target.value)}
                      />
                      <p>Min</p>
                      <button onClick={updateDailyLimit}>Set</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="settingItem" onClick={logoutUser}>
              <div className="settingItem1">
                <p>Log out</p>
              </div>
              <div className="settingItem2">
                <Logout className="logout" />
              </div>
            </div>
          </div>
        </div>
        <div ref={ref3} className="sideModal">
          <div
            className="closeIcon"
            onClick={() => setOpenFollowingModal(false)}
          >
            <Cancel />
          </div>
          <div className="sideModal1">
            <p>Following</p>
          </div>
          <div className="sideModal2">
            <FollowingContent flag={openFollowingModal}/>
          </div>
        </div>
        <div ref={ref4} className="sideModal">
          <div
            className="closeIcon"
            onClick={() => setOpenFollowerModal(false)}
          >
            <Cancel />
          </div>
          <div className="sideModal1">
            <p>Followers</p>
          </div>
          <div className="sideModal2">
            <FollowerContent flag={openFollowerModal} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
