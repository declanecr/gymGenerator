import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAllWorkouts } from '../../hooks/workouts/useAllWorkouts';
import {  Box, CircularProgress, Alert, } from '@mui/material';
import { useGetMe } from '../../hooks/users/useGetMe';
import { useDevice } from '../../context/DeviceContext';
import AdminPageMobile from './AdminPageMobile';
import AdminPageTablet from './AdminPageTablet';
import AdminPageDesktop from './AdminPageDesktop';

export default function AdminPage() {
  const { data: me, isLoading: loadingMe } = useGetMe();
  const { data: workouts, isLoading, error } = useAllWorkouts();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const { isMobile, isTablet } = useDevice();

  if (loadingMe || isLoading) {
    return (
      <Box p={4}>
        <CircularProgress data-testid="loading" />
      </Box>
    );
  }

  if (me?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">Failed to load workouts</Alert>
      </Box>
    );
  }

  const View = isMobile? AdminPageMobile : isTablet ? AdminPageTablet : AdminPageDesktop;

  return (
   <View
      workouts={workouts}
      showTemplateModal={showTemplateModal}
      setShowTemplateModal={setShowTemplateModal}
    />
  );
}