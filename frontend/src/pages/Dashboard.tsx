import React, {useEffect, useState } from 'react'
import {  Box,  CircularProgress, Alert } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate} from 'react-router-dom'
import { fetchWorkouts, Workout } from '../api/workouts'
import { fetchTemplateWorkouts, TemplateWorkout } from '../api/templateWorkouts'

import { useGetMe } from '../hooks/users/useGetMe'

import DashboardMobile from './dashboard/DashboardMobile'
import DashboardTablet from './dashboard/DashboardTablet'
import DashboardDesktop from './dashboard/DashboardDesktop'
import { useDevice } from '../context/DeviceContext'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const {data:me} =useGetMe()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<TemplateWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showWorkoutModal, setShowWorkoutModal] =useState(false);
  const [showTemplateModal,setShowTemplateModal] = useState(false);
  const { isMobile, isTablet } = useDevice()

  const handleLogout = () => {
    logout()    // clear token + state
    navigate('/login')   //redirect immediately
  }

  useEffect(() => {
    Promise.all([
      fetchWorkouts().then(setWorkouts),
      fetchTemplateWorkouts().then(setTemplates),
    ])
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress data-testid="loading" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  const View = isMobile ? DashboardMobile : isTablet ? DashboardTablet : DashboardDesktop
 return (
    <View
      workouts={workouts}
      templates={templates}
      me={me}
      showWorkoutModal={showWorkoutModal}
      setShowWorkoutModal={setShowWorkoutModal}
      showTemplateModal={showTemplateModal}
      setShowTemplateModal={setShowTemplateModal}
      handleLogout={handleLogout}
    />
  )
}
