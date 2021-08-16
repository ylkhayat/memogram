import { Text } from "@ui-kitten/components";
import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useVideos from "../../hooks/useVideos";

const EmptyList = () => (
  <Text status="info" style={styles.guideText}>
    Your gram is pretty empty, spice it up by adding some videos from the
    kitchen up above.
  </Text>
);

const VideoList = () => {
  const { videos } = useVideos();
  const { navigate } = useNavigation();
  const renderItem = useCallback(() => {
    return null;
  }, []);
  return (
    <View>
      <Text category="h4" status="primary" style={styles.header}>
        Gram
      </Text>
      <FlatList
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
