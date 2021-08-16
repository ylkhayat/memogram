import { Icon, Text } from "@ui-kitten/components";
import { format, formatDuration, parseISO } from "date-fns";
import React, { useCallback } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { TMemo } from "../../hooks/useVideos/type";

type Props = {
  memo?: TMemo;
  onPlayVideo?: any;
};

const VideoItem = ({ memo, onPlayVideo }: Props) => {
  const onVideoPress = useCallback(() => {
    onPlayVideo?.(memo.video_url);
  }, [memo]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.videoContainer} onPress={onVideoPress}>
        <Image
          source={{ uri: memo?.thumbnail_url }}
          style={{ position: "absolute", height: 100, width: 100 }}
        />
        <Icon name="play-circle" style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.videoInfoContainer}>
        <Text style={styles.info}>
          Duration: ~
          {formatDuration({ seconds: Math.round(memo?.duration / 1000) })}
        </Text>
        <Text style={styles.info} status="info">
          Created At: {format(parseISO(memo?.created_at), "dd MMM, yyyy")}
        </Text>
      </View>
    </View>
  );
};

export default VideoItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    flexDirection: "row",
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    height: "100%",
  },
  videoInfoContainer: {
    justifyContent: "space-around",
    margin: 20,
  },
  icon: { fontSize: 50 },
  info: { fontSize: 15 },
});
