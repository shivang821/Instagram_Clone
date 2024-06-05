import ProfileImg from "../sideBar/instaAssets/userProfileImage.jpg";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { handleUserFollowing, suggestedUsers_success } from "../../reducers/userReducer";
import axios from "axios";
const SuggestedUserCard = ({ item }) => {
  const dispatch = useDispatch();
  const { suggestedUsers } = useSelector((state) => state.User);
  console.log(suggestedUsers);
  const handleFollowing = async () => {
    const { data } = await axios.patch("/api/addFollowing", {
      user: item._id,
    });
    dispatch(handleUserFollowing(data.following));
    const arr=suggestedUsers.filter(user=>user._id!==item._id)
    dispatch(suggestedUsers_success(arr))
  };
  return (
    <div className="suggestedUserCard">
      <div className="suggestedUserCard1">
        <img src={item.profile ? item.profile.url : ProfileImg} />
      </div>
      <div className="suggestedUserCard2">
        <NavLink to={`/profile/${item._id}`}>{item.username}</NavLink>
        <p>
          {item.name} | {item.followers.length} followers
        </p>
      </div>
      <div className="suggestedUserCard3">
        <p onClick={handleFollowing} >Follow</p>
      </div>
    </div>
  );
};
SuggestedUserCard.propTypes = {
  item: PropTypes.object,
};
export default SuggestedUserCard;
