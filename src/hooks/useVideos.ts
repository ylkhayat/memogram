import { useState, useCallback, useEffect, useRef } from "react";
import firebase from "firebase";

const useVideos = () => {
  const firestoreDb = useRef(firebase.firestore());
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const getVideos = useCallback(async () => {
    try {
      setLoading(true);
      await firestoreDb.current
        ?.collection("videos")
        .get()
        .then((querySnapshot) => {
          const allVideos = querySnapshot.docs;
          setVideos(allVideos);
        });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  return { loading, videos };
};

export default useVideos;
