// DeviceSizeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
const DeviceSizeContext = createContext();

const DeviceSizeProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Example threshold for mobile devices
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DeviceSizeContext.Provider value={{ isMobile }}>
      {children}
    </DeviceSizeContext.Provider>
  );
};

const useDeviceSize = () => {
    return useContext(DeviceSizeContext);
  };
  
  export { DeviceSizeProvider, useDeviceSize };