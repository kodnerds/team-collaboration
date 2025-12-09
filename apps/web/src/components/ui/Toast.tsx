import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
}

const Toast = ({ message, duration = 3000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    }
  }, [message, duration]);

  if (!isVisible) {
    return null;
  }

  return <p className={message && 'toast bg-red-500 text-white p-2 rounded-md'}>{message}</p>;
};

export default Toast;
