import { ReactNode } from 'react'
import DesktopLayout from './devices/DesktopLayout'
import MobileLayout from './devices/MobileLayout'
import { useDevice } from '../context/DeviceContext'
import TabletLayout from './devices/TabletLayout'
import { Grid } from '@mui/material'

interface Props {
  children: ReactNode
}

export default function AdminPageLayout({ children }: Props) {
  const { isMobile, isTablet } = useDevice()
  const Layout = isMobile ? MobileLayout : isTablet ? TabletLayout : DesktopLayout

  return (
    <Layout>
      <Grid container sx={{minHeight:'100vh', minWidth:'100vw'}}>
        {children}
      </Grid>
    </Layout>
  )
}