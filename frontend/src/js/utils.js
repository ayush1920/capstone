import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify, clearUserCred } from "../redux/actions/actions";

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


export const formatRupee = (_number) => {

  if (isNaN(parseInt(_number)) || (_number.constructor === String && _number.includes(','))) {
    return _number;
  }

  const number = _number.toString();
  let split_number = 3
  let final = "";
  let count = 0;
  for (let i = number.length - 1; i > -1; i--) {

    if (count === split_number) {
      final = number[i] + ',' + final;
      count = 2;
    }
    else {
      final = number[i] + final;
      count = count + 1;
    }
  }
  return final;
}


export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [triggerNavigation, setTriggerNavigation] = useState(false);
  useEffect(() => {
    if (triggerNavigation){
      
    }
      
  }, [triggerNavigation]);

  const logout = () => {
    // https://stackoverflow.com/a/27374365
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    localStorage.removeItem('session');
    dispatch(clearUserCred());
    navigate('/', { state: { disableRedirect: true } });
  }
  return logout;
}