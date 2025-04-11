import { HealthRecord } from '../services/api'
import dayjs from 'dayjs'

const today = dayjs()

export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'weight',
    value: 70.5,
    unit: 'kg',
    date: today.subtract(7, 'day').toISOString(),
    notes: 'Morning weight'
  },
  {
    id: '2',
    userId: 'user1',
    type: 'weight',
    value: 70.2,
    unit: 'kg',
    date: today.subtract(6, 'day').toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    type: 'steps',
    value: 8500,
    unit: 'steps',
    date: today.subtract(5, 'day').toISOString(),
  },
  {
    id: '4',
    userId: 'user1',
    type: 'heart_rate',
    value: 72,
    unit: 'bpm',
    date: today.subtract(4, 'day').toISOString(),
    notes: 'Resting heart rate'
  },
  {
    id: '5',
    userId: 'user1',
    type: 'steps',
    value: 10200,
    unit: 'steps',
    date: today.subtract(3, 'day').toISOString(),
  },
  {
    id: '6',
    userId: 'user1',
    type: 'weight',
    value: 70.1,
    unit: 'kg',
    date: today.subtract(2, 'day').toISOString(),
  },
  {
    id: '7',
    userId: 'user1',
    type: 'heart_rate',
    value: 75,
    unit: 'bpm',
    date: today.subtract(1, 'day').toISOString(),
  },
  {
    id: '8',
    userId: 'user1',
    type: 'steps',
    value: 9800,
    unit: 'steps',
    date: today.toISOString(),
  }
]

export const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  name: 'Test User'
}
