import { Button, Icon } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";
import usePermissions from "../../hooks/usePermissions";

const Permissions = () => {
  const {
    hasAudioPermission,
    hasCameraPermission,
    hasLibraryPermission,
    requestAudio,
    requestCamera,
    requestLibrary,
  } = usePermissions();

  console.log({
    hasCameraPermission,
    hasLibraryPermission,
    hasAudioPermission,
  });

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        onPress={requestCamera}
        accessoryRight={<Icon name="camera" />}
        disabled={hasCameraPermission}
      >
        {hasCameraPermission ? "CAMERA PERMITTED" : " REQUEST CAMERA"}
      </Button>
      <Button
        style={styles.button}
        onPress={requestAudio}
        accessoryRight={<Icon name="md-headset" />}
        disabled={hasAudioPermission}
      >
        {hasAudioPermission ? "AUDIO PERMITTED" : "REQUEST AUDIO"}
      </Button>
      <Button
        style={styles.button}
        onPress={requestLibrary}
        accessoryRight={<Icon name="ios-library" />}
        disabled={hasLibraryPermission}
      >
        {hasLibraryPermission ? "LIBRARY PERMITTED" : "REQUEST LIBRARY"}
      </Button>
    </View>
  );
};

export default Permissions;
const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
  },
  button: { marginVertical: 5 },
});
