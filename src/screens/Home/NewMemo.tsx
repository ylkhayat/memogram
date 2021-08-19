import { Button, Icon, Spinner, Text, useTheme } from "@ui-kitten/components";
import { Video } from "expo-av";
import React, { useCallback, useState } from "react";
import { View, StyleSheet, Alert, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { AnimatePresence, MotiView } from "moti";
const { height: HEIGHT } = Dimensions.get("window");
import useVideos from "../../hooks/useVideos";
import usePermissions from "../../hooks/usePermissions";
import Permissions from "./Permissions";
import { Video as VideoCompressor } from "react-native-compressor";
import * as Progress from "react-native-progress";
import { showMessage, hideMessage } from "react-native-flash-message";

const VIDEO_HEIGHT = HEIGHT / 5;

type Props = {
  selected: boolean;
  onSelect: () => void;
};
const NewMemo = ({ selected, onSelect }: Props) => {
  const { loading, memo, updateMemo, createVideo } = useVideos();

  const [compressingProgress, setCompressingProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const { hasPermissions } = usePermissions();
  const { navigate } = useNavigation();

  const getThumbnail = useCallback(async ({ uri, duration }) => {
    const response = await VideoThumbnails.getThumbnailAsync(uri, {
      time: duration / 2,
    });
    return response;
  }, []);

  const onCreateVideo = useCallback(() => {
    createVideo(memo);
  }, [createVideo, memo]);

  const compressVideo = useCallback(async () => {
    if (!memo.uri) return;
    setAttaching(true);
    showMessage({
      message: "Compressing 🗃️!",
      description:
        "Hang on, files larger than 10 MBs always get compressed! This might take some time!",
      type: "info",
      autoHide: false,
    });
    const resultUri = await VideoCompressor.compress(
      memo?.uri,
      {
        compressionMethod: "auto",
      },
      (progress) => {
        setCompressingProgress(progress);
      }
    );

    hideMessage();
    setTimeout(() => setAttaching(false), 1000);
    updateMemo({ uri: resultUri });
  }, [memo]);

  const onCompressVideo = useCallback(async () => {
    Alert.alert(
      "Attention",
      "This will probably take a while. Are you sure?",
      [
        {
          text: "Yes",
          onPress: compressVideo,
        },
        { text: "Cancel" },
      ],
      { cancelable: true }
    );
  }, [compressVideo]);
  const pickVideo = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0,
      videoQuality: 2,
    });

    if (result.cancelled) return;
    const thumbnail = await getThumbnail(result);
    if (thumbnail.uri) updateMemo({ ...result, thumbnail: thumbnail.uri });
  }, []);

  const captureVideo = useCallback(async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0,
      videoQuality: 2,
    });
    if (result.cancelled) return;
    const thumbnail = await getThumbnail(result);
    if (thumbnail.uri) updateMemo({ ...result, thumbnail: thumbnail.uri });
  }, [navigate]);

  const theme = useTheme();
  const primaryColor = theme["color-primary-default"];
  const renderContent = () => (
    <>
      <View style={styles.buttonsContainer}>
        <Button
          style={{ width: "40%" }}
          onPress={pickVideo}
          disabled={uploading || attaching}
        >
          SELECT
        </Button>
        <Button
          style={{ width: "40%" }}
          onPress={captureVideo}
          disabled={uploading || attaching}
        >
          CAPTURE
        </Button>
      </View>
      <AnimatePresence>
        {attaching && (
          <View style={{ alignSelf: "center", marginTop: 10 }}>
            <Progress.Bar
              progress={compressingProgress}
              borderColor={primaryColor}
              color={primaryColor}
            />
          </View>
        )}
      </AnimatePresence>

      <AnimatePresence>
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
                useNativeControls
              />

              <View style={{ flexDirection: "row" }}>
                <Button
                  style={{ width: "40%", marginRight: 10 }}
                  onPress={onCompressVideo}
                  disabled={uploading || attaching}
                  status="danger"
                >
                  COMPRESS
                </Button>
                <Button
                  style={{ width: "40%" }}
                  onPress={onCreateVideo}
                  disabled={uploading || attaching}
                  status="control"
                  accessoryRight={() =>
                    uploading ? (
                      <Spinner status="info" />
                    ) : (
                      <Icon name="paper-plane" />
                    )
                  }
                >
                  UPLOAD
                </Button>
              </View>
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
              Record a new memo to your memogram via one of the options above.
            </Text>
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
  return (
    <View>
      <Text category="h4" status="primary" style={styles.header}>
        Kitchen
      </Text>
      {hasPermissions ? renderContent() : <Permissions />}
      <AnimatePresence>
        {loading && (
          <View style={[StyleSheet.absoluteFill, styles.loaderContainer]}>
            <Spinner status="info" />
          </View>
        )}
      </AnimatePresence>
    </View>
  );
};

export default NewMemo;

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
  },
  loaderContainer: {
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
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
