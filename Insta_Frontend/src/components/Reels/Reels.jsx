import "./reels.css";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader.jsx";
import { useEffect, useRef, useState } from "react";
import { getReels } from "../../actions/postAction";
import ReelComponent from "./ReelComponent";
const Reels = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const ref = useRef();
  const { reels, loading, hasMore } = useSelector((state) => state.Reels);
  const [mute,setMute]=useState(true);
  const { device } = useSelector((state) => state.App);
  // const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (reels.length === 0) {
      dispatch(getReels({ page: 1, limit: 5 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleMute=(muteValue)=>{
    setMute(muteValue);
  }

  // infinite scroll using scrollbar
  // useEffect(() => {
  //   const handleScroll = () => {
  //     let a = device === "mob" ? window.innerHeight - 56 : window.innerHeight;
  //     let b = document.querySelector(".reelsMainDiv").scrollTop;
  //     let c = document.querySelector(".reelsMainDiv").scrollHeight;
  //     console.log(a + b, " ", c);
  //     if (a + b >= c) {
  //       console.log("touch");
  //       // if (!loading && hasMore) {
  //       //   setPage((prev) => prev + 1);
  //       //   dispatch(getReels({ page: page + 1, limit: 2 }));
  //       // }
  //       // setTouch(true);
  //     } else {
  //       // setTouch(false);
  //     }
  //   };
  //   ref.current.addEventListener("scroll", handleScroll);
  //   return () => {
  //     if (ref.current) {
  //       ref.current.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [hasMore, loading, device, dispatch, page]);
 
//  infinite scroll using intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loading && hasMore) {
            setPage((prev) => prev + 1);
            dispatch(getReels({ page: page + 1, limit: 5 }));
          }
        }
      },
      { threshold: .8 }
    );
    if (ref.current.children[reels.length - 1]) {
      observer.observe(ref.current.children[reels.length - 1]);
    }
    return () => {
      if (ref.current&&ref.current.children[reels.length - 1]) {
        observer.unobserve(ref.current.children[reels.length - 1]);
      }
    };
  }, [ref, reels.length, loading,hasMore,page,dispatch,device]);
  
  useEffect(() => {
    let ele;
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      if(ref.current){
        ref.current.scrollTo({top:savedScrollPosition,behaviour:'instant'});
        // ref.current.scrollTop=localStorage.getItem('scrollPosition')||0
      }
    }
    const handleScroll=()=>{
      if(ref.current){
        localStorage.setItem('scrollPosition',ref.current.scrollTop)
      }
    }
    if(ref.current){
      ref.current.addEventListener('scroll',handleScroll)
      ele=ref.current;
    }
    ele.addEventListener('scroll',handleScroll)
    
    return () => {
      ele.removeEventListener('scroll',handleScroll)
    };
  }, []);
  return (
    <motion.div ref={ref} className="reelsMainDiv"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.5 }}
      transition={{
        ease: "linear",
        duration: 0.5,
      }}
    >
      {reels.map((item, i) => {
        return (
          <>
            <ReelComponent mute={mute} handleMute={handleMute} item={item} ind={i} key={i+1} />
          </>
        );
      })}
      {loading && <Loader />}
    </motion.div>
  );
};

export default Reels;
