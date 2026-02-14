import { Alert, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';
import MetricCard from '../components/MetricCard.jsx';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await apiClient.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDashboard(data);
      } catch {
        setError('Dashboard requires a valid admin token. Use backend login endpoint first.');
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>
      {error ? <Alert severity="warning">{error}</Alert> : null}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard title="Total Patients Today" value={dashboard?.total_patients_today} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard title="Tests in Progress" value={dashboard?.tests_in_progress} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard title="Emergency Cases" value={dashboard?.emergency_cases} />
        </Grid>
      </Grid>
    </>
  );
}
