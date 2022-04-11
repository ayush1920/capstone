import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { notify } from "../redux/actions/actions";

export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };

export const useNotifier = () => {
  const dispatch = useDispatch();
  const _notify = (msg) => {
    return dispatch(notify(msg));
  }
  return _notify
}