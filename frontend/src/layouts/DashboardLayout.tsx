import { ReactNode } from 'react'
import DesktopLayout from './devices/DesktopLayout'
import { useDevice } from '../context/DeviceContext'
import MobileLayout from './devices/MobileLayout'
import TabletLayout from './devices/TabletLayout'

interface Props {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const { isMobile, isTablet } = useDevice()
  const Layout = isMobile ? MobileLayout : isTablet ? TabletLayout : DesktopLayout

  return (
    <Layout>
      {children}
    </Layout>
  )
}
