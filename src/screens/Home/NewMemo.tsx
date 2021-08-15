import { Button } from "@ui-kitten/components";
import { Video } from "expo-av";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const NewMemo = () => {
  const [memo, setMemo] = useState({});
  const { navigate } = useNavigation();
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  console.log({ memo });

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMemo(result.uri);
    }
  }, []);

  const captureImage = useCallback(async () => {
    navigate("camera");
  }, [navigate]);

  return (
    <View>
      <View style={styles.buttonsContainer}>
        <Button style={{ width: "40%" }} onPress={pickImage}>
          SELECT
        </Button>
        <Button style={{ width: "40%" }} onPress={captureImage}>
          CAPTURE
        </Button>
      </View>
      <Video />
    </View>
  );
};

export default NewMemo;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
