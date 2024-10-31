import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { clearToastMessage } from "../../features/common/uiSlice";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const dispatch = useDispatch();
  const { toastMessage } = useSelector((state) => state.ui);
  console.log("here", toastMessage);

  useEffect(() => {
    if (toastMessage) {
      const { message, status } = toastMessage;
      if (message !== "" && status !== "") {
        toast[status](message, { theme: "colored" });
        dispatch(clearToastMessage());
      }
    }
  }, [toastMessage, dispatch]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
