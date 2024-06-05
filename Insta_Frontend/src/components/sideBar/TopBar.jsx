// import React from 'react'

// import { useLocation } from "react-router-dom"
// import { NavLink } from "react-router-dom";
import "./topBar.css";
// import { ReactComponent as MessangerIcon } from "./instaAssets/messangerIcon.svg";
// import { ReactComponent as MessangerFillIcon } from "./instaAssets/messangerFillIcon.svg";
// import { useSelector } from "react-redux";
const TopBar = () => {
  // const { device } = useSelector((state) => state.App);
  return (
    <div className="topBar">
      <div className="instagramBrand">
        <h3>InstaClone</h3>
      </div>

      {/* ***************** messanger **************** */}
      {/* <div className="messangerLink">
        <NavLink
          className={({ isActive }) => (isActive ? "activeLink" : "")}
          to="/inbox"
        >
          {({ isActive }) => {
            return (
              <>
                {isActive ? <MessangerFillIcon /> : <MessangerIcon />}
                {device === "lap" && <p>Messages</p>}
              </>
            );
          }}
        </NavLink>
      </div> */}
    </div>
  );
};

export default TopBar;
