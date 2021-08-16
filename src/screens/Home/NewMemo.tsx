import { Button, Text } from "@ui-kitten/components";
import { Video } from "expo-av";
import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { ALLOWED_DURATION_IN_SECS } from "../../constants";
import * as VideoThumbnails from "expo-video-thumbnails";
import useMemoVid from "../../hooks/useMemoVid";

const NewMemo = () => {
  const { memo, updateMemo } = useMemoVid();
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

  return (
    <View>
      <Text category="h4" status="primary" style={styles.header}>
        Kitchen
      </Text>
      <View style={styles.buttonsContainer}>
        <Button style={{ width: "40%" }} onPress={pickImage}>
          SELECT
        </Button>
        <Button style={{ width: "40%" }} onPress={captureVideo}>
          CAPTURE
        </Button>
      </View>
      {!!memo?.uri ? (
        <View style={styles.videoContainer}>
          <Video
            style={{
              height: memo?.height * 0.7,
              width: "100%",
              alignSelf: "center",
            }}
            posterSource={{ uri: memo?.thumbnail }}
            usePoster
            source={{ uri: memo?.uri }}
            useNativeControls
            scaleX={0.7}
            scaleY={0.7}
          />
        </View>
      ) : (
        <Text category="s2" status="hint" style={styles.header}>
          Record a new memo to your memogram via one of the options above.
        </Text>
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
    marginHorizontal: 20,
  },
  video: {},
});
