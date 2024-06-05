import axios from "axios";
import { loadSuggestedPosts,setSuggestedPosts } from "../reducers/suggestedPostsReducer";
export const loadingSuggestedPosts =
  ({ page, limit }) =>
  async (dispatch) => {
    try {
      dispatch(loadSuggestedPosts());
      const { data } = await axios.get(
        `/api/suggestedPosts?page=${page}&limit=${limit}`
      );
      setTimeout(()=>{
        dispatch(setSuggestedPosts(data));
      },1500)
    } catch (error) {
      console.log(error);
    }
  };
