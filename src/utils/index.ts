export const getFilename = (str: string) => {
  return str?.substring(str.lastIndexOf("/") + 1);
};
