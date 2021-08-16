import { useCallback, useState } from "react";

type TMemo = {
  uri?: string;
  duration?: number;
  thumbnail?: string;
};

const useMemoVid = () => {
  const [memo, setMemo] = useState<TMemo>({});
  const updateMemo = useCallback((newMemo: TMemo) => {
    setMemo((prevMemo) => ({ ...prevMemo, ...newMemo }));
  }, []);
  const clearMemo = useCallback(() => {
    setMemo({});
  }, []);

  return { memo, updateMemo, clearMemo };
};

export default useMemoVid;
