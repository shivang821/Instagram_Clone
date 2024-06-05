import axios from 'axios';
import { REELS_ERROR, REELS_REQUEST, REELS_SUCCESS } from '../reducers/reelsReducer';

export const getReels = ({ page, limit }) => async (dispatch) => {
	try {
		dispatch(REELS_REQUEST());
		const { data } = await axios.get(`/api/reels?page=${page}&limit=${limit}`);
		if (data) {
			setTimeout(() => {
				dispatch(REELS_SUCCESS(data));
			}, 2000);
		}
	} catch (error) {
        console.log(error);
		dispatch(REELS_ERROR('error'));
	}
};

