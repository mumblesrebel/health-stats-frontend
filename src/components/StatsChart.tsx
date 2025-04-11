import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Paper, Typography, Box } from '@mui/material'
import { format } from 'date-fns'
import { HealthRecord } from '../services/api'

interface StatsChartProps {
  data: HealthRecord[]
  metric: string
}

interface ChartData {
  date: string
  [key: string]: string | number
}

export function StatsChart({ data, metric }: StatsChartProps) {
  const chartData: ChartData[] = data.map((record) => ({
    date: format(new Date(record.date), 'MMM d'),
    [record.type]: record.value,
  }))

  // Group data by date for multiple metrics
  const groupedData = chartData.reduce((acc: ChartData[], curr) => {
    const existingDate = acc.find((item) => item.date === curr.date)
    if (existingDate) {
      return acc.map((item) =>
        item.date === curr.date ? { ...item, ...curr } : item
      )
    }
    return [...acc, curr]
  }, [])

  // Sort by date
  groupedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Get unique metrics
  const metrics = metric === 'all' 
    ? Array.from(new Set(data.map((record) => record.type)))
    : [metric]

  // Color mapping for different metrics
  const colors = {
    weight: '#2196f3',
    steps: '#4caf50',
    heart_rate: '#f44336',
    blood_pressure: '#ff9800',
  }

  return (
    <Paper sx={{ p: 2, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Health Metrics Over Time
      </Typography>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {metrics.map((metricType) => (
              <Line
                key={metricType}
                type="monotone"
                dataKey={metricType}
                stroke={colors[metricType as keyof typeof colors]}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={metricType.replace('_', ' ').toUpperCase()}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
