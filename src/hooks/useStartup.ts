import React from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

export default function useStartup() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "font-thin": Poppins_100Thin,
          "font-extra-light": Poppins_200ExtraLight,
          "font-light": Poppins_300Light,
          "font-regular": Poppins_400Regular,
          "font-medium": Poppins_500Medium,
          "font-semi-bold": Poppins_600SemiBold,
          "font-bold": Poppins_700Bold,
          "font-extra-bold": Poppins_800ExtraBold,
          "font-black": Poppins_900Black,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoading;
}
