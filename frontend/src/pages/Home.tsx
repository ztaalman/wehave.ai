import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Create Your AI-Powered Digital Presence
          </Typography>
          <Typography variant="h5" paragraph>
            Build professional profiles, websites, and chatbots that showcase your skills and experience.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              AI Profile Generation
            </Typography>
            <Typography>
              Let AI help you create a professional profile that highlights your strengths.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Digital Business Cards
            </Typography>
            <Typography>
              Create and share digital business cards with QR codes and contact information.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              AI Chatbot
            </Typography>
            <Typography>
              Deploy an AI chatbot that can answer questions about your experience and skills.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 