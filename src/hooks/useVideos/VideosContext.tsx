import React from "react";
import useVideos from "./useVideos";

export const VideosContext = React.createContext<ReturnType<typeof useVideos>>(
  {} as any
);

export const VideosContextProvider = ({ children }: any) => {
  const videosUtils = useVideos();

  return (
    <VideosContext.Provider value={videosUtils}>
      {children}
    </VideosContext.Provider>
  );
};
