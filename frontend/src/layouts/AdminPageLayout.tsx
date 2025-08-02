import { ReactNode } from 'react'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'
import { useDevice } from '../context/DeviceContext'

interface Props {
  children: ReactNode
}

export default function AdminPageLayout({ children }: Props) {
  const { isDesktop } = useDevice()
  const Layout = isDesktop ? DesktopLayout : MobileLayout

  return (
    <Layout>
      {children}
    </Layout>
  )
}