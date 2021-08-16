import { PermissionsContext } from "./PermissionsContext";
import { useContext } from "react";

const usePermissions = () => {
  const permissionsUtils = useContext(PermissionsContext);
  return permissionsUtils;
};

export default usePermissions;
