import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Health Stats Tracker
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/stats">
            Stats
          </Button>
          <Button color="inherit" component={RouterLink} to="/profile">
            Profile
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
