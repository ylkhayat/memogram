import { Button, Icon, Spinner, Text } from "@ui-kitten/components";
import { Video } from "expo-av";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Platform, Alert, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { ALLOWED_DURATION_IN_SECS } from "../../constants";
import * as VideoThumbnails from "expo-video-thumbnails";
import { AnimatePresence, MotiView } from "moti";
const { height: HEIGHT } = Dimensions.get("window");
import useVideos from "../../hooks/useVideos";

const VIDEO_HEIGHT = HEIGHT / 3.5;

const NewMemo = () => {
  const { memo, updateMemo, clearMemo, createVideo } = useVideos();

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
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

  const onCreateVideo = useCallback(() => {
    createVideo(memo);
  }, [createVideo, memo]);

  const pickVideo = useCallback(async () => {
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

  return (
    <View>
      <Text category="h4" status="primary" style={styles.header}>
        Kitchen
      </Text>
      <View style={styles.buttonsContainer}>
        <Button
          style={{ width: "40%" }}
          onPress={pickVideo}
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
              onPress={onCreateVideo}
              disabled={uploading}
              status="control"
              accessoryRight={() =>
                uploading ? (
                  <Spinner status="info" />
                ) : (
                  <Icon name="paper-plane" />
                )
              }
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
