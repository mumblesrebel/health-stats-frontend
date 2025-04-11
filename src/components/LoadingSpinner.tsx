import React from 'react'
import { CircularProgress, Container, Typography } from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'error' | 'success'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...',
  size = 'md',
  color = 'primary' as const,
  className = ''
}) => {
  return (
    <Container 
      className={className}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      <CircularProgress 
        size={size === 'sm' ? 24 : size === 'lg' ? 48 : 32}
        color={color}
      />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Container>
  )
}

export default LoadingSpinner
