import { Paper, Typography, Box } from '@mui/material'

export function Profile() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          {/* Profile form will go here */}
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          {/* Preferences form will go here */}
        </Paper>
      </Box>
    </div>
  )
}
