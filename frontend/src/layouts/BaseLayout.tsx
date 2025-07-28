import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import NavBar from '../components/common/NavBar'

interface BaseLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

const BaseLayout = ({ children, sidebar }: BaseLayoutProps) => {
  return (
    <Box>
      <NavBar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {sidebar && (
            <Grid size={{ xs: 12, md: 4}}>
              {sidebar}
            </Grid>
          )}
          <Grid size={{ xs: 12, md: sidebar ? 8 : 12 }}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default BaseLayout
