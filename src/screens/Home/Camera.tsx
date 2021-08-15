import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { Icon, useTheme } from "@ui-kitten/components";
import { Audio } from "expo-av";

const MAX_DURATION = 10;

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const { navigate, goBack } = useNavigation();
  const theme = useTheme();
  const primaryColor = theme["color-primary-default"];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      await Audio.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  console.log({ isRecording });
  const onToggleRecordPress = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef?.current?.stopRecording();
    } else {
      setIsRecording(true);
      cameraRef?.current
        ?.recordAsync({ maxDuration: MAX_DURATION, mute: true })
        .then(({ uri }) => {
          setIsRecording(false);
          console.log({ uri });

          //   navigate("home", { recodedMemoUri: uri });
        })
        .catch((e) => {
          console.log("Hey", e);
        })
        .finally(() => {
          setIsRecording(false);
        });
    }
  }, [navigate, isRecording]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={type}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon
            name="ios-arrow-back-outline"
            style={{ color: primaryColor, fontSize: 40 }}
          />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <View style={styles.button} />

          <TouchableOpacity
            style={styles.recordButton}
            onPress={onToggleRecordPress}
          >
            <Icon
              name={isRecording ? "stop-circle" : "recording"}
              style={{ color: primaryColor, fontSize: 70 }}
            />
          </TouchableOpacity>
          <View style={styles.button} />
        </View>
      </Camera>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    margin: 15,
    width: "20%",
  },
  recordButton: {
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
