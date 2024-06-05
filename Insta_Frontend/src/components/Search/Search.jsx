import "./search.css";
import { motion } from "framer-motion";
import ProfileImg from '../sideBar/instaAssets/userProfileImage.jpg'
import { ReactComponent as CancelIcon } from "../Profile/assets/crossImage.svg";
import { ReactComponent as SearchIcon } from "./assets/searchIcon.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchLoader from "./SearchLoader";
import { NavLink } from "react-router-dom";
const Search = () => {
  const [inpValue, setInpValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setInpValue(e.target.value);
  };
  useEffect(() => {
    if (inpValue) {
      setLoading(true);
    } else {
      setResults([]);
      setLoading(false);
    }
    const fetchData = async () => {
      const { data } = await axios.get(`/api/searchResult/${inpValue}`);
      setResults(data.result);
      setLoading(false);
    };
    const id = setTimeout(() => {
      if (inpValue) {
        fetchData();
      }
    }, [1500]);
    return () => {
      clearTimeout(id);
    };
  }, [inpValue]);
  return (
    <motion.div
      className="search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.5 }}
      transition={{
        ease: "linear",
        duration: 0.5,
      }}
    >
      <div className="search2">
        <div className="search21">
          <div>
            <div>
              {<SearchIcon className="searchIcon" />}
              <input
                type="text"
                value={inpValue}
                onChange={handleChange}
                placeholder="Search"
              />
              {inpValue && (
                <CancelIcon
                  onClick={() => {
                    setInpValue("");
                    setResults([]);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="search22">
          {loading ? (
            <SearchLoader />
          ) : (
            <>
              {results.map((item, i) => {
                return (
                  <NavLink className="searchCard" key={i} to={`/profile/${item._id}`}>
                    <div className="searchCard1">
                      <img src={item.profile?item.profile.url:ProfileImg} />
                    </div>
                    <div className="searchCard2">
                      <p>{item.username}</p>
                      <p>{item.name} | {item.followers.length} followers</p>
                    </div>
                  </NavLink>
                );
              })}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Search;
