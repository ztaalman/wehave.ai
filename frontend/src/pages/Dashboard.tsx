import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Container, Typography, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BarChartIcon from '@mui/icons-material/BarChart';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  cta: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, action, cta }) => (
  <Paper 
    elevation={4}
    sx={{ 
      p: 3, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      height: '100%',
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(233, 30, 99, 0.3)',
      }
    }}
  >
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        {icon}
        <Typography variant="h6" component="h3" sx={{ ml: 1.5, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <Button variant="contained" onClick={action} sx={{ mt: 3 }}>
      {cta}
    </Button>
  </Paper>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 65px)', overflow: 'hidden' }}>
      {/* Reusing the Orbs from Login/Register for a consistent feel */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          top: '-100px',
          left: '70vw',
          background: 'radial-gradient(circle, #4A148C 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          top: '50vh',
          left: '-100px',
          background: 'radial-gradient(circle, #E91E63 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: -1,
        }}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome back, {user?.name || 'User'}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ready to shape your digital identity?
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4
          }}
        >
          <ActionCard 
            title="AI Profile Generator"
            description="Let our AI craft a compelling professional profile for you based on a few key details. Stand out from the crowd effortlessly."
            icon={<AutoAwesomeIcon color="primary" sx={{ fontSize: 32 }} />}
            action={() => navigate('/profile')}
            cta="Generate with AI"
          />
          <ActionCard 
            title="Digital Business Card"
            description="Design and manage your digital business card. Share your details instantly with a personalized QR code."
            icon={<QrCode2Icon color="primary" sx={{ fontSize: 32 }} />}
            action={() => navigate('/business-card')}
            cta="Manage Card"
          />
          <ActionCard 
            title="Your Public Profile"
            description="View and edit your main profile page. This is what others will see when they scan your QR code or visit your link."
            icon={<AccountBoxIcon color="primary" sx={{ fontSize: 32 }}/>}
            action={() => navigate('/profile')}
            cta="Edit Profile"
          />
          <ActionCard 
            title="Analytics"
            description="(Coming Soon) See how many times your profile has been viewed, where your visitors are coming from, and more."
            icon={<BarChartIcon color="primary" sx={{ fontSize: 32 }} />}
            action={() => {}}
            cta="View Analytics"
          />
        </Box>
      </Container>
    </Box>
  );
}; 