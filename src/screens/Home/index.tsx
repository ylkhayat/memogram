import { Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import NewMemo from "./NewMemo";
import VideoList from "./VideoList";

const Home = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <Text category="h4">Welcome to your</Text>
      <Text category="h4">Memogram</Text>
      <NewMemo />
      <VideoList />
    </View>
  );
};

export default Home;
