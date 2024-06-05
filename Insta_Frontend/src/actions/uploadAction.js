
import { UPLOAD_ERROR, UPLOAD_REQUEST, UPLOAD_SUCCESS } from '../reducers/uploadReducer';
import axios from 'axios';

export const upload = (myForm) => async (dispathc) => {
	try {
		dispathc(UPLOAD_REQUEST());
		const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		await axios.post('/api/new/post', myForm , config);
		dispathc(UPLOAD_SUCCESS());
	} catch (error) {
		dispathc(UPLOAD_ERROR('somthing went wrong'));
	}
};


// ********** production mode

// import { v4 } from 'uuid';
// import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
// import { storage } from '../firebase';
// import { UPLOAD_ERROR, UPLOAD_REQUEST, UPLOAD_SUCCESS } from '../reducers/uploadReducer';
// import axios from 'axios';

// export const upload = (uploadFiles, postType) => async (dispathc) => {
// 	try {
// 		dispathc(UPLOAD_REQUEST());
// 		let uploadArr = [];
// 		for (let i = 0; i < uploadFiles.length; i++) {
// 			const postRef = ref(storage, `posts/${uploadFiles[i].type + v4()}`);
// 			const snapshot = await uploadBytes(postRef, uploadFiles[i].data);
// 			const url = await getDownloadURL(snapshot.ref);
// 			const obj = { url, uid: postRef.name, fileType: uploadFiles[i].type };
// 			uploadArr.push(obj);
// 		}
// 		const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// 		const { data } = await axios.post('/new/post', { postType, posts: JSON.stringify(uploadArr) }, config);

// 		dispathc(UPLOAD_SUCCESS());
// 	} catch (error) {
// 		dispathc(UPLOAD_ERROR('somthing went wrong'));
// 	}
// };
