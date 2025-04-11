import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Paper } from '@mui/material'
import dayjs from 'dayjs'
import { HealthRecord } from '../services/api'

interface StatsTableProps {
  data: HealthRecord[]
}

export function StatsTable({ data }: StatsTableProps) {
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params: { value: string }) =>
        dayjs(params.value).format('MMM D, YYYY HH:mm'),
    },
    {
      field: 'type',
      headerName: 'Metric',
      width: 150,
      valueFormatter: (params: { value: string }) =>
        params.value.replace('_', ' ').toUpperCase(),
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 120,
      type: 'number',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      width: 120,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      flex: 1,
    },
  ]

  const rows = data.map((record) => record)

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: 'date', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 20, 50]}
      />
    </Paper>
  )
}
