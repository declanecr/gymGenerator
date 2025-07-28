// src/components/nav/NavBar.tsx
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material'

const NavBar = () => {
  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            GymGenerator
          </Typography>

          <Box>
            {/* Future nav links or user menu here */}
            <Typography variant="body2">Menu</Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
