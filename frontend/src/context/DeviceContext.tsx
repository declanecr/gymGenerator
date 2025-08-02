import { createContext, useContext } from 'react';

interface DeviceType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const DeviceContext = createContext<DeviceType | undefined>(undefined);



export const useDevice = (): DeviceType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
