import { useEffect, useRef, useState } from "react";
import "./createModal.css";
import { useDispatch, useSelector } from "react-redux";
import { SET_MODAL_OPEN } from "../../reducers/appReducer";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { ReactComponent as CreatePost } from "./assets/createPost.svg";
import { ReactComponent as ArrowIcon } from "./assets/arrowIcon.svg";
import { ReactComponent as Back } from "./assets/backIcon.svg";
import { ReactComponent as MuteIcon } from "./assets/muteIcon.svg";
import { ReactComponent as UnMuteIcon } from "./assets/unMuteIcon.svg";
import { upload } from "../../actions/uploadAction";
import { UPLOAD_RESET } from "../../reducers/uploadReducer";
const CreateModal = () => {
  const dispatch = useDispatch();
  const vidRef = useRef(null);
  const [mute, setMute] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [count, setCount] = useState(0);
  const scope = useRef(null);
  const { loading, success } = useSelector((state) => state.Upload);

  const handleMuteUnMute = () => {
    setMute(!mute);
  };
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const type = file.type.substring(0, file.type.indexOf("/"));
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prevFiles) => [...prevFiles, { data: reader.result, type }]);
      };
      reader.readAsDataURL(file);
      setUploadFiles((preFiles) => [...preFiles, file]);
    });
  };
  const [postType, setPostType] = useState("");
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept:
      postType === "post"
        ? {
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
            "video/mp4": [".mp4"],
          }
        : { "video/mp4": [".mp4"] },
    noClick: true,
    multiple: postType === "reel" ? false : true,
  });
  useEffect(() => {
    function handleClickOutside(e) {
      if (!loading && scope.current && !scope.current.contains(e.target)) {
        dispatch(SET_MODAL_OPEN(false));
        dispatch(UPLOAD_RESET());
      }
    }
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [files, dispatch, loading, uploadFiles]);
  const uploadPosts = async () => {
    const myForm = new FormData();
    uploadFiles.forEach((file) => {
      myForm.append("files", file);
    });
    myForm.set("postType", postType);
    dispatch(upload(myForm));
  };
  const back = () => {
    if (files.length > 0) {
      setCount(0);
      setFiles([]);
      setUploadFiles([]);
      dispatch(UPLOAD_RESET());
    } else if (postType !== "") {
      setPostType("");
    }
  };
  return (
    <motion.div
      className="createModal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
      <div className="innerModal" ref={scope}>
        <div className="createModalTop">
          {postType === "" ? (
            <p>Create new post or reel</p>
          ) : (
            <p>Create {postType}</p>
          )}
          {postType !== "" && (
            <div className="backIcon" onClick={() => back()}>
              {" "}
              <Back />{" "}
            </div>
          )}
          {count === files.length - 1 && !success && (
            <button className="nextButton" onClick={uploadPosts}>
              Next
            </button>
          )}
        </div>
        {files.length === 0 ? (
          <div {...getRootProps()} className="createModaBottom">
            {postType === "" && (
              <div className="emptyPost">
                <button onClick={() => setPostType("post")}>Crete Post</button>
                <button onClick={() => setPostType("reel")}>Crete Reel</button>
              </div>
            )}
            {postType === "post" && (
              <div>
                <input {...getInputProps()} />
                <CreatePost />
                <p>Drag photos here</p>
                <div id="postDiv">
                  <label htmlFor="postInp">Select from device</label>
                  <input
                    multiple
                    onChange={(e) => {
                      onDrop([...e.target.files]);
                    }}
                    name="files"
                    type="file"
                    style={{ visibility: "hidden" }}
                    accept="image/png,image/jpg,image/jpeg,video/mp4"
                    id="postInp"
                  />
                </div>
              </div>
            )}
            {postType === "reel" && (
              <div>
                <input {...getInputProps()} />
                <CreatePost />
                <p>Drag videos here</p>
                <div id="postDiv">
                  <label htmlFor="postInp">Select from device</label>
                  <input
                    name="files"
                    onChange={(e) => {
                      onDrop([...e.target.files]);
                    }}
                    type="file"
                    style={{ visibility: "hidden" }}
                    accept="video/mp4"
                    id="postInp"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            className="files"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "linear" }}
          >
            <motion.div
              className="itemDiv"
              key={count}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "linear" }}
            >
              {files[count].type === "video" ? (
                <div>
                  <video
                    autoPlay
                    loop
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noplaybackrate"
                    src={files[count].data}
                    ref={vidRef}
                    muted={mute}
                    onClick={(e) => handleMuteUnMute(e)}
                  />
                  {!mute ? (
                    <UnMuteIcon
                      className="unMuteIcon"
                      onClick={handleMuteUnMute}
                    />
                  ) : (
                    <MuteIcon className="muteIcon" onClick={handleMuteUnMute} />
                  )}
                </div>
              ) : (
                <img src={files[count].data} alt="" />
              )}
            </motion.div>

            {count !== 0 && (
              <div
                className="left"
                onClick={() => {
                  if (count > 0) {
                    setCount(count - 1);
                  }
                }}
              >
                <ArrowIcon />
              </div>
            )}
            {count !== files.length - 1 && (
              <div
                className="right"
                onClick={() => {
                  if (count < files.length - 1) {
                    setCount(count + 1);
                  }
                }}
              >
                <ArrowIcon />
              </div>
            )}

            <div
              className="bar1"
              style={{ display: `${loading ? "block" : "none"}` }}
            >
              <div className="progress1"></div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CreateModal;
