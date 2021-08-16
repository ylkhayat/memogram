import React from "react";
import usePermissions from "./usePermissions";

export const PermissionsContext = React.createContext<
  ReturnType<typeof usePermissions>
>({} as any);

export const PermissionsContextProvider = ({ children }: any) => {
  const permissionsUtils = usePermissions();

  return (
    <PermissionsContext.Provider value={permissionsUtils}>
      {children}
    </PermissionsContext.Provider>
  );
};
