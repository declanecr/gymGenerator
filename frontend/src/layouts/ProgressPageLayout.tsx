import { ReactNode } from 'react'
import DesktopLayout from './devices/DesktopLayout'
import MobileLayout from './devices/MobileLayout'
import { useDevice } from '../context/DeviceContext'
import TabletLayout from './devices/TabletLayout'

interface Props {
  children: ReactNode
}

export default function ProgressPageLayout({ children }: Props) {
  const { isMobile, isTablet } = useDevice()
  const Layout = isMobile ? MobileLayout : isTablet ? TabletLayout : DesktopLayout

  return (
    <Layout>
      {children}
    </Layout>
  )
}