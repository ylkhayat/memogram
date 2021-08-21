import { Text } from "@ui-kitten/components";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import NewMemo from "./NewMemo";
import VideosList from "../VideosList";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [selectedMode, setSelectedMode] = useState(0);

  const onMode0Select = useCallback(() => {
    setSelectedMode(0);
  }, []);

  const onMode1Select = useCallback(() => {
    setSelectedMode(1);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <Text category="h4">Welcome to your</Text>
      <Text category="h4">Memogram</Text>
      <Text status="info" style={{ textAlign: "center", marginTop: 10 }}>
        Videos are compressed to 1/2 the original quality but with an infinite
        duration. 🔥
      </Text>
      <NewMemo selected={selectedMode === 0} onSelect={onMode0Select} />
      <VideosList selected={selectedMode === 1} onSelect={onMode1Select} />
    </SafeAreaView>
  );
};

export default Home;
