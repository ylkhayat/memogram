import { Text } from "@ui-kitten/components";
import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useVideos from "../../hooks/useVideos";
import VideoItem from "./VideoItem";

const EmptyList = () => (
  <Text status="info" style={styles.guideText}>
    Your gram is pretty empty, spice it up by adding some videos from the
    kitchen up above.
  </Text>
);

const VideoList = () => {
  const { loading, videos, getVideos } = useVideos();
  const { navigate } = useNavigation();
  const renderItem = useCallback(({ item }: any) => {
    console.log(item);

    return <VideoItem memo={item} />;
  }, []);
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
    alignItems: "center",
    marginHorizontal: 20,
  },
  guideText: {
    marginVertical: 20,
    textAlign: "center",
  },
  video: {},
});
