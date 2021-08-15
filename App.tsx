import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import theme from "./mapping/theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { IonIconsPack } from "./src/components/Icon";

import Navigator from "./src/navigation";

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <IconRegistry icons={IonIconsPack} />

      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <Navigator />
      </ApplicationProvider>
    </>
  );
}
