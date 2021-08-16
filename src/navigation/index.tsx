import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Loader from "../screens/Loader";
import useStartup from "../hooks/useStartup";
import { VideosContextProvider } from "../hooks/useVideos/VideosContext";
import { PermissionsContextProvider } from "../hooks/usePermissions/PermissionsContext";

const STACK_OPTIONS = { headerShown: false };

const Stack = createNativeStackNavigator();

function Navigator() {
  const loading = useStartup();
  return (
    <VideosContextProvider>
      <PermissionsContextProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={STACK_OPTIONS}>
            {loading ? (
              <Stack.Screen name="loader" component={Loader} />
            ) : (
              <>
                <Stack.Screen name="home" component={Home} />
                <Stack.Screen name="video" component={Home} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PermissionsContextProvider>
    </VideosContextProvider>
  );
}

export default Navigator;
