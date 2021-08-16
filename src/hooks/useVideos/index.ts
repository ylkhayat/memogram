import { VideosContext } from "./VideosContext";
import { useContext } from "react";

const useVideos = () => {
  const videosUtils = useContext(VideosContext);
  return videosUtils;
};

export default useVideos;
