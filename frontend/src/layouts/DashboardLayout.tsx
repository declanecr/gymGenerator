import { ReactNode } from 'react'
import BaseLayout from './BaseLayout'
// import { ListItemButton } from '@mui/material/ListItemButton'

interface Props {
  children: ReactNode
}

/*
  // call this inside BaseLayout<sidebar ={<Sidebar />}> to have a sidebar appear
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
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}
