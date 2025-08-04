import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import MobileNavBar from '../../components/common/MobileNavBar'

interface LayoutProps {
  children: ReactNode
}

const MobileLayout = ({ children }: LayoutProps) => {
  return (
    <Box>
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