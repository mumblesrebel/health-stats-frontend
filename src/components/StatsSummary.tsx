import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Paper, Typography, Box } from '@mui/material'
import dayjs from 'dayjs'
import { HealthRecord, healthApi } from '../services/api'

interface ChartData {
  date: string
  value: number
}

export function StatsSummary() {
  const [data, setData] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await healthApi.getHealthRecords()
        setData(response.data)
      } catch (error) {
        console.error('Failed to fetch health records:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const chartData: ChartData[] = data
    .slice(-7) // Get last 7 records
    .map((record) => ({
      date: dayjs(record.date).format('MMM D'),
      value: record.value,
    }))

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Last 7 Days Trend
      </Typography>
      <Box sx={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2196f3"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
