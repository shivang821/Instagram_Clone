// import React, { useState } from 'react';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Splash from "./components/auth/Splash";
import { fetchUser } from "./actions/userActions";
import SideBar from "./components/sideBar/SideBar";
import Reels from "./components/Reels/Reels.jsx";
import Messages from "./components/Messages/Messages.jsx";
import Profile from "./components/Profile/Profile.jsx";
import { AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
// import TopBar from './components/sideBar/TopBar';

import Search from "./components/Search/Search";
import CreateModal from "./components/CreateModal/CreateModal";
import axios from "axios";
import { update_dailyLimit_exceed } from "./reducers/userReducer.js";
import LimitExceedPage from "./components/LimitExceed/LimitExceedPage.jsx";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
const Login = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./components/auth/Login")), 2000);
  });
});
const Home = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./components/Home/Home.jsx")), 2000);
  });
});
function App() {
  const { isAuthenticate } = useSelector((state) => state.User);
  const { modalOpen } = useSelector((state) => state.App);
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isDailyLimitExceed } = useSelector((state) => state.User);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      if (user.isDailyLimitSet && user.screenTime < user.dailyLimit) {
        var timeId = setInterval(async () => {
          const { data } = await axios.patch("/api/usage");
          console.log(data);
          if (data.exceed) {
            dispatch(update_dailyLimit_exceed(data));
            clearInterval(timeId);
          } else {
            dispatch(update_dailyLimit_exceed(data));
          }
        }, [60 * 1000]);
      }
      if (user.screenTime === user.dailyLimit) {
        dispatch(
          update_dailyLimit_exceed({
            exceed: true,
            screenTime: user.screenTime,
          })
        );
      } else {
        dispatch(
          update_dailyLimit_exceed({
            exceed: false,
            screenTime: user.screenTime,
          })
        );
      }
    }
  }, [user, dispatch]);
  useEffect(() => {
    async function handleUnload() {
      localStorage.setItem("tab", "posts");
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.addEventListener("beforeunload", handleUnload);
    };
  }, []);
  return (
    <>
      {}
      <Suspense fallback={<Splash />}>
        {isAuthenticate ? (
          <div className="app">
            {/* {device==='mob' && <TopBar />} */}
            <SideBar />
            <div className="app2">
              <AnimatePresence location={location} key={location.pathname}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/search"
                    element={
                      isDailyLimitExceed && user.isDailyLimitSet ? (
                        <LimitExceedPage />
                      ) : (
                        <Search />
                      )
                    }
                  />
                  <Route
                    path="/inbox"
                    element={
                      isDailyLimitExceed && user.isDailyLimitSet ? (
                        <LimitExceedPage />
                      ) : (
                        <Messages />
                      )
                    }
                  />
                  <Route
                    path="/reels"
                    element={
                      isDailyLimitExceed && user.isDailyLimitSet ? (
                        <LimitExceedPage />
                      ) : (
                        <Reels />
                      )
                    }
                  />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="/profile/:id"
                    element={
                      isDailyLimitExceed&& user.isDailyLimitSet ? <LimitExceedPage /> : <UserProfile />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </div>
            {modalOpen && (
              <AnimatePresence>
                <CreateModal />
              </AnimatePresence>
            )}
          </div>
        ) : (
          <div className="loginApp">
            <Routes>
              <Route path="/" element={<Login />} />
              {/* <Route path="/" element={<Navigate to="/login" />} /> */}
            </Routes>
          </div>
        )}
      </Suspense>
    </>
  );
}

export default App;
