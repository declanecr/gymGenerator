import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import MobileNavBar from '../../components/common/MobileNavBar'

interface LayoutProps {
  children: ReactNode
}

const MobileLayout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',   // full dynamic viewport height
      width: '100dvw',
      overflowX: 'hidden'
    }}>
      <Container maxWidth="sm" sx={{ pb: 8 }}>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Container>
      <MobileNavBar />
    </Box>
  )
}

export default MobileLayout