import { Icon, Text, useTheme } from "@ui-kitten/components";
import React, { useCallback, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import useVideos from "../../hooks/useVideos";
import VideoItem from "./VideoItem";
import Modal from "react-native-modal";
import { Video } from "expo-av";

const EmptyList = () => (
  <Text status="info" style={styles.guideText}>
    Your gram is pretty empty, spice it up by adding some videos from the
    kitchen up above.
  </Text>
);

const VideoList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewMemo, setPreviewMemo] = useState({});
  const { loading, videos, getVideos } = useVideos();
  const theme = useTheme();
  const primaryColor = theme["color-primary-default"];
  const renderItem = useCallback(({ item }: any) => {
    const onPlayVideo = () => {
      setModalVisible(true);
      setPreviewMemo(item);
    };
    return <VideoItem memo={item} onPlayVideo={onPlayVideo} />;
  }, []);

  const onCloseModal = () => setModalVisible(false);
  return (
    <View>
      <Text category="h4" status="primary" style={styles.header}>
        Gram
      </Text>
      <FlatList
        refreshing={loading}
        onRefresh={getVideos}
        data={videos}
        renderItem={renderItem}
        ListEmptyComponent={EmptyList}
      />
      <Modal isVisible={modalVisible}>
        <View style={styles.videoContainer}>
          <TouchableOpacity
            onPress={onCloseModal}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
            }}
          >
            <Icon
              name="ios-arrow-back-outline"
              style={{
                color: primaryColor,
                fontSize: 40,
              }}
            />
          </TouchableOpacity>
          <Video
            resizeMode="contain"
            style={styles.video}
            source={{ uri: previewMemo.video_url }}
            useNativeControls
          />
        </View>
      </Modal>
    </View>
  );
};

export default VideoList;

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
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  guideText: {
    marginVertical: 20,
    textAlign: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
    marginVertical: 20,
  },
});
