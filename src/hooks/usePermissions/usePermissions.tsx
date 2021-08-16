import { Camera } from "expo-camera";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as Linking from "expo-linking";
import * as IntentLauncher from "expo-intent-launcher";

const usePermissions = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasLibraryPermission, setHasLibraryPermission] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);

  const openSettingsOnDeny = useCallback((status) => {
    if (status === ImagePicker.PermissionStatus.DENIED)
      if (Platform.OS === "ios") {
        Linking.openURL("app-settings:");
      } else {
        IntentLauncher.startActivityAsync(
          IntentLauncher.ACTION_PRIVACY_SETTINGS
        );
      }
  }, []);

  const requestCamera = useCallback(async () => {
    if (Platform.OS === "web") return;
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === ImagePicker.PermissionStatus.GRANTED);
    openSettingsOnDeny(status);
  }, []);

  const requestLibrary = useCallback(async () => {
    if (Platform.OS === "web") return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasLibraryPermission(status === ImagePicker.PermissionStatus.GRANTED);
    openSettingsOnDeny(status);
  }, []);

  const requestAudio = useCallback(async () => {
    if (Platform.OS === "web") return;
    const { status } = await Audio.requestPermissionsAsync();
    setHasAudioPermission(status === ImagePicker.PermissionStatus.GRANTED);
    openSettingsOnDeny(status);
  }, []);

  useEffect(() => {
    requestCamera();
    requestLibrary();
    requestAudio();
  }, [requestCamera, requestLibrary, requestAudio]);

  return {
    hasPermissions:
      hasCameraPermission && hasLibraryPermission && hasAudioPermission,
    hasCameraPermission,
    hasLibraryPermission,
    hasAudioPermission,
    requestCamera,
    requestAudio,
    requestLibrary,
  };
};

export default usePermissions;
