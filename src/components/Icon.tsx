import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

export const IonIconsPack = {
  name: "ion",
  icons: createIconsMap(),
};

function createIconsMap() {
  return new Proxy(
    {},
    {
      get(_, name) {
        return IconProvider(name);
      },
    }
  );
}

const IconProvider = (name) => ({
  toReactElement: (props) => IconIcon({ name, ...props }),
});

function IconIcon({ name, style = {} }) {
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return <Icon name={name} size={height} color={tintColor} style={iconStyle} />;
}
