import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material'
import { healthApi } from '../services/api'

const healthMetrics = [
  { value: 'weight', label: 'Weight (kg)' },
  { value: 'steps', label: 'Steps' },
  { value: 'heart_rate', label: 'Heart Rate (bpm)' },
  { value: 'blood_pressure', label: 'Blood Pressure (mmHg)' },
]

export function QuickActions() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    try {
      await healthApi.createHealthRecord({
        type,
        value: parseFloat(value),
        date: new Date().toISOString(),
        notes,
        userId: 'current-user', // This should come from auth context
        unit: healthMetrics.find((m) => m.value === type)?.label.split(' ')[1] || '',
      })
      handleClose()
      // TODO: Refresh dashboard data
    } catch (error) {
      console.error('Failed to create health record:', error)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setType('')
    setValue('')
    setNotes('')
  }

  return (
    <>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpen(true)}
        >
          Add Health Metric
        </Button>
        <Button variant="outlined" color="primary" fullWidth>
          View All Stats
        </Button>
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Health Metric</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              select
              label="Metric Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
            >
              {healthMetrics.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
            />
            <TextField
              label="Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
