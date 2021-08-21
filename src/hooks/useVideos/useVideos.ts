import { useState, useCallback, useEffect, useRef } from "react";
import firebase from "firebase";
import set from "lodash/set";
import { getFilename } from "../../utils";
import { TMemo } from "./type";
import { showMessage } from "react-native-flash-message";

const useVideos = () => {
  const firestoreDb = useRef(firebase.firestore());
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState<TMemo>({});

  const updateMemo = useCallback((newMemo: TMemo) => {
    const { uri, thumbnail } = newMemo;
    let updates = {};
    if (uri) set(updates, "videoName", getFilename(uri));
    if (thumbnail) set(updates, "thumbnailName", getFilename(thumbnail));
    setMemo((prevMemo) => ({
      ...prevMemo,
      ...newMemo,
      ...updates,
    }));
  }, []);

  const clearMemo = useCallback(() => {
    setMemo({});
  }, []);

  const getVideos = useCallback(async () => {
    try {
      setLoading(true);
      await firestoreDb.current
        ?.collection("videos")
        .orderBy("created_at", "desc")
        .get()
        .then((querySnapshot) => {
          const allVideos = querySnapshot.docs;

          setVideos(allVideos.map((singleVid) => singleVid.data()));
        });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  const createVideo = useCallback(async (memo: TMemo) => {
    setLoading(true);
    await firestoreDb.current
      .collection("videos")
      .add({
        thumbnail_url: "",
        video_url: "",
        created_at: new Date().toISOString(),
        duration: memo.duration,
      })
      .then(async (video) => {
        const { downloadVideoURL, downloadThumbnailURL } = await uploadFiles(
          video.id,
          memo
        );
        showMessage({
          message: "Success!",
          description: "Upload was a success!",
          type: "success",
        });
        video
          .update({
            video_url: downloadVideoURL,
            thumbnail_url: downloadThumbnailURL,
          })
          .then(() => {
            clearMemo();
            getVideos();
          });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const prepareBlobs = useCallback(async (memo: TMemo) => {
    showMessage({
      message: "Getting your files ready!",
      description: "Hang in there pal 💥",
      type: "warning",
      autoHide: false,
    });
    const { uri, compressedUri, thumbnail } = memo;
    if (!uri || !compressedUri) return;
    const videoBlob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", compressedUri || uri, true);
      xhr.send(null);
    });
    if (!thumbnail) return;
    const thumbnailBlob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", thumbnail, true);
      xhr.send(null);
    });
    return { videoBlob, thumbnailBlob };
  }, []);

  const uploadFiles = useCallback(async (id: string, memo: TMemo) => {
    showMessage({
      message: "Uploading 🏹",
      description: "Your video is being carried to the cloud ☁️.",
      type: "info",
      autoHide: false,
    });
    const { videoBlob, thumbnailBlob } = await prepareBlobs(memo);
    const refVideo = firebase.storage().ref(memo?.videoName);
    const snapshotVideo = await refVideo.put(videoBlob);
    const refThumbnail = firebase.storage().ref(memo?.thumbnailName);
    const snapshotThumbnail = await refThumbnail.put(thumbnailBlob);
    videoBlob.close();
    thumbnailBlob.close();

    const downloadVideoURL = await snapshotVideo.ref.getDownloadURL();
    const downloadThumbnailURL = await snapshotThumbnail.ref.getDownloadURL();
    return { downloadVideoURL, downloadThumbnailURL };
  }, []);

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  return {
    memo,
    loading,
    videos,
    updateMemo,
    clearMemo,
    getVideos,
    createVideo,
  };
};

export default useVideos;
