import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import theme from "./mapping/theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { IonIconsPack } from "./src/components/Icon";
import "react-native-reanimated";
import Navigator from "./src/navigation";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import FlashMessage from "react-native-flash-message";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: "AIzaSyBfI1tdOhLEygHXQVEwP5bc6pUu6wyobJk",
  authDomain: "memogram-2ac9b.firebaseapp.com",
  databaseURL: "https://memogram-2ac9b-default-rtdb.firebaseio.com",
  projectId: "memogram-2ac9b",
  storageBucket: "memogram-2ac9b.appspot.com",
  messagingSenderId: "172374101918",
  appId: "1:172374101918:web:625a7406ca60d96da1108f",
  measurementId: "G-S6NMR7N3Q4",
};

firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously();

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <IconRegistry icons={IonIconsPack} />

      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <Navigator />
      </ApplicationProvider>
      <FlashMessage
        duration={1000}
        position="top"
        statusBarHeight={Constants.statusBarHeight}
        icon={{ icon: "auto", position: "right" }}
        titleStyle={{ fontFamily: "font-regular" }}
      />
    </>
  );
}
