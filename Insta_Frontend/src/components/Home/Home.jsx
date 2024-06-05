// import React from 'react'
import { useEffect, useRef, useState } from "react";
import "./home.css";
import TopBar from "../sideBar/TopBar";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { suggestedUsers_success } from "../../reducers/userReducer";
import SuggestedUserCard from "./SuggestedUserCard";
import { loadingSuggestedPosts } from "../../actions/suggestedPostAction";
import SuggestedPostCard from "./SuggestedPostCard";
import PostLoader from "./PostLoader";
const Home = () => {
  const [device, setDevice] = useState();
  const ref = useRef();
  const [mute, setMute] = useState(true);
  const { suggestedUsers } = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const [suggestedUserLoading, setSuggestedUserLoading] = useState(false);
  let arr = [0, 1, 2, 3, 4];
  const [page, setPage] = useState(1);
  const { suggestedPosts, hasMore, loading } = useSelector(
    (state) => state.SuggestedPosts
  );
  useEffect(() => {
    function handleResize() {
      const deviceWidth = window.innerWidth;
      if (deviceWidth > 1439) {
        setDevice("lap");
      } else if (deviceWidth >= 768 && deviceWidth < 1440) {
        setDevice("tab");
      } else if (deviceWidth < 768) {
        setDevice("mob");
      }
    }
    if (!localStorage.getItem("darkmode")) {
      localStorage.setItem("darkmode", "disable");
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleMute = (muteValue) => {
    setMute(muteValue);
  };
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      setSuggestedUserLoading(true);
      const { data } = await axios.get("/api/suggestedUser");
      dispatch(suggestedUsers_success(data.suggestedUsers));
      setTimeout(() => {
        setSuggestedUserLoading(false);
      }, [1500]);
    };
    if (suggestedUsers.length === 0) {
      fetchSuggestedUser();
    }
    const fetchSuggestedPosts = async () => {
      dispatch(loadingSuggestedPosts({ page, limit: 5 }));
    };
    fetchSuggestedPosts();
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loading && hasMore) {
            setPage((prev) => prev + 1);
            dispatch(loadingSuggestedPosts({ page: page + 1, limit: 5 }));
          }
        }
      },
      { threshold: 0.8 }
    );
    if (ref.current.children[suggestedPosts.length - 1]) {
      observer.observe(ref.current.children[suggestedPosts.length - 1]);
    }
    return () => {
      if (ref.current && ref.current.children[suggestedPosts.length - 1]) {
        observer.unobserve(ref.current.children[suggestedPosts.length - 1]);
      }
    };
  }, [ref, suggestedPosts.length, loading, hasMore, page, dispatch, device]);
  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.5 }}
      transition={{
        ease: "linear",
        duration: 0.5,
      }}
    >
      {device === "mob" && <TopBar />}

      {(suggestedUserLoading === true || suggestedUsers.length !== 0) &&
        device === "lap" && (
          <div className="suggestedUserDiv">
            <div className="suggestedUserDiv1">
              <p>Suggested for you</p>
            </div>
            <div className="suggestedUserDiv2">
              {!suggestedUserLoading ? (
                <>
                  {suggestedUsers.map((item, i) => {
                    return <SuggestedUserCard item={item} key={i} />;
                  })}
                </>
              ) : (
                <>
                  {arr.map((item, i) => {
                    return (
                      <>
                        <div className="suggestedLoaderCard" key={i}>
                          <div
                            style={{ animationDelay: `${i * 0.1}s` }}
                            className="suggestedLoaderCard1"
                          ></div>
                          <div className="suggestedLoaderCard2">
                            <p style={{ animationDelay: `${i * 0.1}s` }}></p>
                            <p style={{ animationDelay: `${i * 0.1}s` }}></p>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      <div className="homeCenter">
        <div className="homeCenter1">
          <p>Suggested Posts</p>
        </div>
        <div className="homeCenter2" ref={ref}>
          {suggestedPosts.map((post, i) => {
            return (
              <SuggestedPostCard
                post={post}
                key={i}
                mute={mute}
                handleMute={handleMute}
              />
            );
          })}
          {loading && <PostLoader />}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
