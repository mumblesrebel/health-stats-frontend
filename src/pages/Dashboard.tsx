import { Paper, Typography, Box } from '@mui/material'
import { StatsSummary } from '../components/StatsSummary'
import { QuickActions } from '../components/QuickActions'
import { useAuth } from '../services/AuthContext'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
        <StatsSummary />
        <Paper sx={{ height: '100%' }}>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            Quick Actions
          </Typography>
          <QuickActions />
        </Paper>
      </Box>
    </div>
  )
}
