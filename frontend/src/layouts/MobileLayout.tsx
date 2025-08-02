import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import MobileNavBar from '../components/common/MobileNavBar'

interface LayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

const MobileLayout = ({ children, sidebar }: LayoutProps) => {
  return (
    <Box>
      <Container maxWidth="md" sx={{ pb: 8 }}>
        <Grid container spacing={2}>
          {sidebar && (
            <Grid size={{ xs: 12 }}>
              {sidebar}
            </Grid>
          )}
          <Grid size={12}>
            {children}
          </Grid>
        </Grid>
      </Container>
      <MobileNavBar />
    </Box>
  )
}

export default MobileLayout