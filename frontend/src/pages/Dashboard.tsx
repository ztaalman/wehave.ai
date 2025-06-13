import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import BusinessCard from '../components/BusinessCard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.email}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: { md: 2 } }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Your Business Card
            </Typography>
            <BusinessCard />
          </Paper>
        </Box>
        <Box sx={{ flex: { md: 1 } }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Add quick action buttons here */}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}; 