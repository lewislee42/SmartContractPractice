import { useState, useEffect } from "react";

const ErrorPopup = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Automatically hide the popup after `duration` time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Set visibility to false after timeout
    }, duration);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [duration]);

  // Conditionally apply the slide-out animation
  return (
    <div
      className={`rounded-lg bg-red-500 text-white shadow-lg transition-transform duration-650 ease-in-out 
      ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
    >
      {message}
    </div>
  );
};

export default ErrorPopup;
