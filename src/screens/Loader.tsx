import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <AnimatedLottieView
        style={{
          width: 400,
          height: 400,
        }}
        source={require("../../assets/lotties/loading.json")}
        loop
        autoPlay
      />
    </View>
  );
};

export default Loader;
