import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import NavBar from '../../components/common/NavBar'

interface LayoutProps {
  children: ReactNode
}

const TabletLayout = ({ children }: LayoutProps) => {
  return (
    <Box>
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
