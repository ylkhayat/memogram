import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Loader from "../screens/Loader";
import Camera from "../screens/Home/Camera";
import useStartup from "../hooks/useStartup";

const STACK_OPTIONS = { headerShown: false };

const Stack = createNativeStackNavigator();

function Navigator() {
  const loading = useStartup();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={STACK_OPTIONS}>
        {loading ? (
          <Stack.Screen name="loader" component={Loader} />
        ) : (
          <>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="video" component={Home} />
            <Stack.Screen name="camera" component={Camera} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
