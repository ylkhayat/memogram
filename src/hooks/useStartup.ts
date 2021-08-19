import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import firebase from "firebase";

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
  const [isFontsLoading, setIsFontsLoading] = useState(true);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      try {
        SplashScreen.preventAutoHideAsync();

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
          setIsFontsLoading(false);
        }, 1500);
        SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  useEffect(() => {
    setIsFirebaseLoading(firebase.apps.length > 0 || true);
  }, [firebase.apps.length]);

  return isFontsLoading && isFirebaseLoading;
}
