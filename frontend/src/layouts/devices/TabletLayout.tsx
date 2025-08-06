import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import NavBar from '../../components/common/NavBar'

interface LayoutProps {
  children: ReactNode
}

const TabletLayout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',   // full dynamic viewport height
      width: '100dvw',
      overflowX: 'hidden'
    }}>
      <NavBar />

      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
            {children}
        </Grid>
      </Container>
    </Box>
  )
}

export default TabletLayout
