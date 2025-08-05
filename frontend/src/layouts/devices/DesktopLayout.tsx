import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import NavBar from '../../components/common/NavBar'

interface DesktopLayoutProps {
  children: ReactNode
}

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  return (
    <Box sx={{width: '100%', height: '100%'}}>
      <NavBar />

      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Container>
    </Box>
  )
}

export default DesktopLayout
