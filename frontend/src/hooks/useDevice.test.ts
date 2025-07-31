import { renderHook } from '@testing-library/react';
import { useDeviceType } from './useDevice';
import * as mui from '@mui/material';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        useTheme: jest.fn(),
        useMediaQuery: jest.fn(),
    };
});

describe('useDeviceType', () => {
    const mockTheme = {
        breakpoints: {
            down: jest.fn(),
            between: jest.fn(),
            up: jest.fn(),
        },
    };

    beforeEach(() => {
        (mui.useTheme as jest.Mock).mockReturnValue(mockTheme);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return isMobile true when mobile query matches', () => {
        (mockTheme.breakpoints.down as jest.Mock).mockReturnValue('down-sm');
        (mockTheme.breakpoints.between as jest.Mock).mockReturnValue('between-sm-md');
        (mockTheme.breakpoints.up as jest.Mock).mockReturnValue('up-md');

        (mui.useMediaQuery as jest.Mock)
            .mockImplementation((query: string) => query === 'down-sm');

        const { result } = renderHook(() => useDeviceType());

        expect(result.current.isMobile).toBe(true);
        expect(result.current.isTablet).toBe(false);
        expect(result.current.isDesktop).toBe(false);
    });

    it('should return isTablet true when tablet query matches', () => {
        (mockTheme.breakpoints.down as jest.Mock).mockReturnValue('down-sm');
        (mockTheme.breakpoints.between as jest.Mock).mockReturnValue('between-sm-md');
        (mockTheme.breakpoints.up as jest.Mock).mockReturnValue('up-md');

        (mui.useMediaQuery as jest.Mock)
            .mockImplementation((query: string) => query === 'between-sm-md');

        const { result } = renderHook(() => useDeviceType());

        expect(result.current.isMobile).toBe(false);
        expect(result.current.isTablet).toBe(true);
        expect(result.current.isDesktop).toBe(false);
    });

    it('should return isDesktop true when desktop query matches', () => {
        (mockTheme.breakpoints.down as jest.Mock).mockReturnValue('down-sm');
        (mockTheme.breakpoints.between as jest.Mock).mockReturnValue('between-sm-md');
        (mockTheme.breakpoints.up as jest.Mock).mockReturnValue('up-md');

        (mui.useMediaQuery as jest.Mock)
            .mockImplementation((query: string) => query === 'up-md');

        const { result } = renderHook(() => useDeviceType());

        expect(result.current.isMobile).toBe(false);
        expect(result.current.isTablet).toBe(false);
        expect(result.current.isDesktop).toBe(true);
    });

    it('should return all false if no queries match', () => {
        (mockTheme.breakpoints.down as jest.Mock).mockReturnValue('down-sm');
        (mockTheme.breakpoints.between as jest.Mock).mockReturnValue('between-sm-md');
        (mockTheme.breakpoints.up as jest.Mock).mockReturnValue('up-md');

        (mui.useMediaQuery as jest.Mock).mockReturnValue(false);

        const { result } = renderHook(() => useDeviceType());

        expect(result.current.isMobile).toBe(false);
        expect(result.current.isTablet).toBe(false);
        expect(result.current.isDesktop).toBe(false);
    });
});