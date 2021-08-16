import { Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import NewMemo from "./NewMemo";
import VideosList from "../VideosList";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
    <Text category="h4">Welcome to your</Text>
    <Text category="h4">Memogram</Text>
    <NewMemo />
    <VideosList />
  </SafeAreaView>
);

export default Home;
