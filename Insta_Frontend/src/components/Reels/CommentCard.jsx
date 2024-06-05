import PropTypes from "prop-types";
import './commentCard.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const CommentCard = ({ comment }) => {
    const navigate=useNavigate()
    const [lineClamp,setLineClamp]=useState(false)
  return (
    <div className="comment">
      <div className="comment1">
        <img src={comment.submittedBy.profile.url} alt="" />
      </div>
      <div className="comment2">
        <p onClick={()=>{navigate(`/profile/${comment.submittedBy._id}`)}}>{comment.submittedBy.username}</p>
        <p onClick={() => setLineClamp(!lineClamp)}
          className={
            lineClamp ? "clamp postCard3Desc" : "noclamp postCard3Desc"
          }>{comment.comment}</p>
      </div>
    </div>
  );
};
CommentCard.propTypes = {
  comment: PropTypes.object,
};
export default CommentCard;
