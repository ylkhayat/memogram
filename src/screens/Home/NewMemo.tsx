import { Button, Text } from "@ui-kitten/components";
import { Video } from "expo-av";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Platform, Alert, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { ALLOWED_DURATION_IN_SECS } from "../../constants";
import * as VideoThumbnails from "expo-video-thumbnails";
import useMemoVid from "../../hooks/useMemoVid";
import { AnimatePresence, MotiView } from "moti";
import firebase from "firebase";
const { height: HEIGHT } = Dimensions.get("window");

const VIDEO_HEIGHT = HEIGHT / 3.5;

const NewMemo = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { memo, updateMemo, clearMemo } = useMemoVid();
  const { navigate } = useNavigation();
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  console.log({ memo });

  const getThumbnail = useCallback(async ({ uri, duration }) => {
    const response = await VideoThumbnails.getThumbnailAsync(uri, {
      time: duration / 2,
    });
    return response;
  }, []);

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled) return;
    if (result.duration > ALLOWED_DURATION_IN_SECS * 1000) {
      Alert.alert(
        "Lengthy Memo 😕",
        "Due to limited storage we only allow videos less than 10 seconds"
      );
      return;
    }
    const thumbnail = await getThumbnail(result);
    if (thumbnail.uri) updateMemo({ ...result, thumbnail: thumbnail.uri });
  }, []);

  const captureVideo = useCallback(async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
      videoMaxDuration: ALLOWED_DURATION_IN_SECS,
    });
    if (result.cancelled) return;
    const thumbnail = await getThumbnail(result);
    if (thumbnail.uri) updateMemo({ ...result, thumbnail: thumbnail.uri });
  }, [navigate]);

  const uploadImage = useCallback(async () => {
    const { uri } = memo;
    const filename = uri?.substring(uri.lastIndexOf("/") + 1);
    const uploadUri = Platform.OS === "ios" ? uri?.replace("file://", "") : uri;
    setUploading(true);
    try {
      await firebase
        .storage()
        .ref(filename)
        .putFile(uploadUri)
        .on("state_changed", (snapshot) => {
          setProgress(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
        });
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    clearMemo();
    setProgress(0);
    Alert.alert(
      "Photo uploaded!",
      "Your photo has been uploaded to Firebase Cloud Storage!"
    );
  }, []);

  return (
    <View>
      <Text category="h4" status="primary" style={styles.header}>
        Kitchen
      </Text>
      <View style={styles.buttonsContainer}>
        <Button
          style={{ width: "40%" }}
          onPress={pickImage}
          disabled={uploading}
        >
          SELECT
        </Button>
        <Button
          style={{ width: "40%" }}
          onPress={captureVideo}
          disabled={uploading}
        >
          CAPTURE
        </Button>
      </View>
      <AnimatePresence></AnimatePresence>
      {!!memo?.uri ? (
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
          }}
        >
          <View style={styles.videoContainer}>
            <Video
              resizeMode="contain"
              style={styles.video}
              source={{ uri: memo?.uri }}
              posterSource={{ uri: memo?.thumbnail }}
              usePoster
              useNativeControls
            />
            <Button
              style={{ width: "40%" }}
              onPress={uploadImage}
              disabled={uploading}
              status="control"
            >
              {uploading ? "HANG ON" : "UPLOAD"}
            </Button>
          </View>
        </MotiView>
      ) : (
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
          }}
        >
          <Text status="info" style={styles.guideText}>
            {uploading
              ? `Uploading... Hang on!{'\n'}${progress}% done`
              : "Record a new memo to your memogram via one of the options above."}
          </Text>
        </MotiView>
      )}
    </View>
  );
};

export default NewMemo;

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  videoContainer: {
    alignItems: "center",
  },
  guideText: {
    marginVertical: 20,
    textAlign: "center",
  },
  video: {
    width: "100%",
    height: VIDEO_HEIGHT,
    alignSelf: "center",
    marginVertical: 20,
  },
});
