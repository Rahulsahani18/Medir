// Components/ToastHandler.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearError } from '../Redux/authSlice';

const ToastHandler = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear error after showing toast
    if (error) {
      // Check if error is an object with message property
      const errorMessage = typeof error === 'object' 
        ? (error.message || error.error || 'An error occurred') 
        : error;
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Clear error after showing
      setTimeout(() => {
        dispatch(clearError());
      }, 100);
    }
  }, [error, dispatch]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
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

export default ToastHandler;