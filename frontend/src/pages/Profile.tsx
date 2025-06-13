import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProfileData {
  title: string;
  bio: string;
  skills: string[];
  experience: string;
  education: string;
}

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    title: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/profiles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch('http://localhost:3000/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={profileData.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            multiline
            rows={4}
            value={profileData.bio}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Skills (comma-separated)"
            name="skills"
            value={profileData.skills.join(', ')}
            onChange={(e) => {
              const skills = e.target.value.split(',').map((skill) => skill.trim());
              setProfileData((prev) => ({ ...prev, skills }));
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Experience"
            name="experience"
            multiline
            rows={4}
            value={profileData.experience}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Education"
            name="education"
            multiline
            rows={4}
            value={profileData.education}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={saving}
            sx={{ mt: 3 }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}; 