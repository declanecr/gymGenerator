import { ReactNode } from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import NavBar from '../components/common/NavBar';
import MobileNavBar from '../components/common/MobileNavBar';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  // Anything not mobile or tablet is considered desktop

  const containerMaxWidth = isMobile
    ? 'sm'
    : isTablet
    ? 'md'
    : false; // full‑width for desktop

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh', // dynamic viewport height
        width: '100dvw',
        overflowX: 'hidden',
      }}
    >
      {/* Top nav for tablet & desktop */}
      {!isMobile && <NavBar />}

      <Container
        maxWidth={containerMaxWidth}
        sx={{
          mt: !isMobile ? 2 : 0, // margin‑top for larger screens
          pb: isMobile ? 8 : 0,  // bottom padding to clear MobileNavBar
        }}
      >
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Container>

      {/* Bottom nav for mobile */}
      {isMobile && <MobileNavBar />}
    </Box>
  );
};

export default DefaultLayout;