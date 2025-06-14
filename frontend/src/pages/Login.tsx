import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

interface OrbProps {
  size: number;
  top: string | number;
  left: string | number;
  color: string;
}

const Orb: React.FC<OrbProps> = ({ size, top, left, color }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
      borderRadius: '50%',
      filter: 'blur(40px)',
      zIndex: -1,
    }}
  />
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Orb size={400} top="-100px" left="70vw" color="#4A148C" />
      <Orb size={300} top="50vh" left="-100px" color="#E91E63" />

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            padding: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
            Sign In
          </Typography>
          <Typography component="p" sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
            Welcome back! Please enter your details.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>or</Divider>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                  Google
                </Button>
                <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
                  Facebook
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 