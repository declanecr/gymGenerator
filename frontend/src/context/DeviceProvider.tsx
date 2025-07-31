import React, { ReactNode } from 'react';
import { useDeviceType } from '../hooks/useDevice';
import { DeviceContext } from './DeviceContext';

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const device = useDeviceType(); // dynamically evaluates on load + resize

  return (
    <DeviceContext.Provider value={device}>
      {children}
    </DeviceContext.Provider>
  );
};