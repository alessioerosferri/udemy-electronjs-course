import {ADD_VIDEO, ADD_VIDEOS, REMOVE_VIDEO, REMOVE_ALL_VIDEOS, VIDEO_PROGRESS, VIDEO_COMPLETE} from "./types";
import {ipcRenderer} from "electron";
import _ from "lodash";
let listenerHasBeenSet;

export const addVideos = videos => dispatch => {
  ipcRenderer.send("videos:add", videos);
  //using once instead of on to not resubscribes multiple times to the event
  ipcRenderer.once("videos:metadata", (event, videosWithData) => {
    dispatch({type: ADD_VIDEOS, payload: videosWithData});
  });
};


export const convertVideos = () => (dispatch, getState) => {
  const {videos} = getState();

  ipcRenderer.send("videos:convert", videos);
  if (!listenerHasBeenSet){
    listenerHasBeenSet = true;
    ipcRenderer.on("video:converted", (event, {video, outputPath}) => {
      dispatch({type: VIDEO_COMPLETE, payload: {...video, outputPath}});
    });
    ipcRenderer.on("conversion:progress", (event, {video, timemark})=>{
      dispatch({type: VIDEO_PROGRESS, payload: {...video, timemark}});
    });
  }
};

// TODO: Open the folder that the newly created video
// exists in
export const showInFolder = outputPath => dispatch => {
  ipcRenderer.send("video:open", outputPath);
};

export const addVideo = video => {
  return {
    type: ADD_VIDEO,
    payload: {...video}
  };
};

export const setFormat = (video, format) => {
  return {
    type: ADD_VIDEO,
    payload: {...video, format, err: ""}
  };
};

export const removeVideo = video => {
  return {
    type: REMOVE_VIDEO,
    payload: video
  };
};

export const removeAllVideos = () => {
  return {
    type: REMOVE_ALL_VIDEOS
  };
};
