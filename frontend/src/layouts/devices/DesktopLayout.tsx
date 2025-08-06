import { ReactNode } from 'react'
import { Box, Grid } from '@mui/material'
import NavBar from '../../components/common/NavBar'

interface DesktopLayoutProps {
  children: ReactNode
}

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',   // full dynamic viewport height
      width: '100dvw',
      overflowX: 'hidden'
    }}>
      <NavBar />

      <Box sx={{flexGrow: 1, overflow: 'auto', width: 1}}>
        <Grid container sx={{flex: 1, height: 1, width: 1}}>
          {children}
        </Grid>
      </Box>
    </Box>
  )
}

export default DesktopLayout
