import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Box,
  Chip,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useState } from 'react'
import dayjs from 'dayjs'

const healthMetrics = [
  { value: 'all', label: 'All Metrics' },
  { value: 'weight', label: 'Weight' },
  { value: 'steps', label: 'Steps' },
  { value: 'heart_rate', label: 'Heart Rate' },
  { value: 'blood_pressure', label: 'Blood Pressure' },
]

const dateRanges = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
]

interface StatsFilterProps {
  onFilterChange: (filters: {
    metric: string
    startDate: Date
    endDate: Date
  }) => void
}

export function StatsFilter({ onFilterChange }: StatsFilterProps) {
  const [metric, setMetric] = useState('all')
  const [dateRange, setDateRange] = useState<number | 'custom'>(7)
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const [showCustomRange, setShowCustomRange] = useState(false)

  const handleDateRangeChange = (days: number | 'custom') => {
    setDateRange(days)
    if (days === 'custom') {
      setShowCustomRange(true)
    } else {
      setShowCustomRange(false)
      const end = dayjs()
      const start = end.subtract(days, 'day')
      setStartDate(start)
      setEndDate(end)
      onFilterChange({ metric, startDate: start.toDate(), endDate: end.toDate() })
    }
  }

  const handleApplyFilters = () => {
    onFilterChange({ metric, startDate: startDate.toDate(), endDate: endDate.toDate() })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3 }}>
        <TextField
          select
          label="Metric"
          value={metric}
          onChange={(e) => {
            setMetric(e.target.value)
            onFilterChange({ metric: e.target.value, startDate: startDate.toDate(), endDate: endDate.toDate() })
          }}
          sx={{ minWidth: 150 }}
        >
          {healthMetrics.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Stack direction="row" spacing={1}>
            {dateRanges.map((range) => (
              <Chip
                key={range.value}
                label={range.label}
                onClick={() => handleDateRangeChange(range.value as number | 'custom')}
                color={dateRange === range.value ? 'primary' : 'default'}
                variant={dateRange === range.value ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>
      </Stack>

      {showCustomRange && (
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mb: 3 }}
          alignItems="center"
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => date && setStartDate(date)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => date && setEndDate(date)}
          />
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply
          </Button>
        </Stack>
      )}
    </LocalizationProvider>
  )
}
