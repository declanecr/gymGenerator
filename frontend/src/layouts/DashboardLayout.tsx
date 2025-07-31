import { ReactNode } from 'react'
import DesktopLayout from './DesktopLayout'
import { useDevice } from '../context/DeviceContext'
import MobileLayout from './MobileLayout'
// import { ListItemButton } from '@mui/material/ListItemButton'

interface Props {
  children: ReactNode
}

/*
  // call this inside DesktopLayout<sidebar ={<Sidebar />}> to have a sidebar appear
  const TestSidebar = () => (
    <Box sx={{ p: 2 }}>
      <List dense>
        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Workouts" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Templates" />
        </ListItemButton>
      </List>
    </Box>
  )
    */

export default function DashboardLayout({ children }: Props) {
  const { isMobile } = useDevice()
  const Layout = isMobile ? MobileLayout : DesktopLayout

  return (
    <Layout>
      {children}
    </Layout>
  )
}
