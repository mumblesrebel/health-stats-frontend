import { Typography, Stack } from '@mui/material'
import { useState, useEffect } from 'react'
import { StatsFilter } from '../components/StatsFilter'
import { StatsChart } from '../components/StatsChart'
import { StatsTable } from '../components/StatsTable'
import { HealthRecord, healthApi } from '../services/api'

export function Stats() {
  const [data, setData] = useState<HealthRecord[]>([])
  const [filteredData, setFilteredData] = useState<HealthRecord[]>([])
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await healthApi.getHealthRecords()
        setData(response.data)
        setFilteredData(response.data)
      } catch (error) {
        console.error('Failed to fetch health records:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = ({ metric, startDate, endDate }: {
    metric: string
    startDate: Date
    endDate: Date
  }) => {
    setSelectedMetric(metric)
    const filtered = data.filter((record) => {
      const recordDate = new Date(record.date)
      const matchesMetric = metric === 'all' || record.type === metric
      const matchesDateRange =
        recordDate >= startDate && recordDate <= endDate
      return matchesMetric && matchesDateRange
    })
    setFilteredData(filtered)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Health Statistics
      </Typography>

      <StatsFilter onFilterChange={handleFilterChange} />

      <Stack spacing={3}>
        <StatsChart data={filteredData} metric={selectedMetric} />
        <StatsTable data={filteredData} />
      </Stack>
    </div>
  )
}
