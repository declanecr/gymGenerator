import React from 'react';
import { render } from '@testing-library/react';
import { DeviceProvider } from './DeviceProvider';
import { DeviceContext } from './DeviceContext';
import { useDeviceType } from '../hooks/useDevice';

// Mock useDeviceType hook
jest.mock('../hooks/useDevice', () => ({
    useDeviceType: jest.fn(),
}));

interface DeviceType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}


describe('DeviceProvider', () => {
    it('provides the device value from useDeviceType to context', () => {
        (useDeviceType as jest.Mock).mockReturnValue('mobile');

        let contextValue: DeviceType | undefined;
        const TestComponent = () => {
            contextValue = React.useContext(DeviceContext);
            return <div>Test</div>;
        };

        render(
            <DeviceProvider>
                <TestComponent />
            </DeviceProvider>
        );

        expect(contextValue).toBe('mobile');
    });

    it('renders children', () => {
        (useDeviceType as jest.Mock).mockReturnValue('desktop');
        const { getByText } = render(
            <DeviceProvider>
                <span>Child Element</span>
            </DeviceProvider>
        );
        expect(getByText('Child Element')).toBeInTheDocument();
    });
});