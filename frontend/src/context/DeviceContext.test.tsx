import React from 'react';
import { render } from '@testing-library/react';
import { DeviceContext, useDevice } from './DeviceContext';

describe('useDevice', () => {
    const TestComponent = () => {
        const device = useDevice();
        return (
            <div>
                <span data-testid="isMobile">{device.isMobile ? 'true' : 'false'}</span>
                <span data-testid="isTablet">{device.isTablet ? 'true' : 'false'}</span>
                <span data-testid="isDesktop">{device.isDesktop ? 'true' : 'false'}</span>
            </div>
        );
    };

    it('throws error when used outside DeviceProvider', () => {
        // Suppress error boundary logs
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<TestComponent />)).toThrow(
            'useDevice must be used within a DeviceProvider'
        );
        spy.mockRestore();
    });

    it('provides device context values when used within DeviceProvider', () => {
        const deviceValue = { isMobile: true, isTablet: false, isDesktop: false };
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceValue}>
                <TestComponent />
            </DeviceContext.Provider>
        );
        expect(getByTestId('isMobile').textContent).toBe('true');
        expect(getByTestId('isTablet').textContent).toBe('false');
        expect(getByTestId('isDesktop').textContent).toBe('false');
    });
});