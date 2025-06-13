import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Profile {
  id: number;
  title: string;
  bio: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
    description: string;
  }[];
}

const Profile: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    duration: '',
    description: '',
  });
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    year: '',
    description: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/profiles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3000/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill && profile) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter((skill) => skill !== skillToRemove),
      });
    }
  };

  const handleAddExperience = () => {
    if (profile && Object.values(newExperience).every((value) => value)) {
      setProfile({
        ...profile,
        experience: [...profile.experience, newExperience],
      });
      setNewExperience({
        company: '',
        position: '',
        duration: '',
        description: '',
      });
    }
  };

  const handleAddEducation = () => {
    if (profile && Object.values(newEducation).every((value) => value)) {
      setProfile({
        ...profile,
        education: [...profile.education, newEducation],
      });
      setNewEducation({
        institution: '',
        degree: '',
        year: '',
        description: '',
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={profile?.title || ''}
              onChange={(e) => setProfile(profile ? { ...profile, title: e.target.value } : null)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Bio"
              value={profile?.bio || ''}
              onChange={(e) => setProfile(profile ? { ...profile, bio: e.target.value } : null)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                label="New Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <IconButton onClick={handleAddSkill} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile?.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            <Grid container spacing={2}>
              {profile?.experience.map((exp, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{exp.position}</Typography>
                    <Typography variant="subtitle2">{exp.company}</Typography>
                    <Typography variant="body2">{exp.duration}</Typography>
                    <Typography variant="body2">{exp.description}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={newExperience.company}
                    onChange={(e) =>
                      setNewExperience({ ...newExperience, company: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={newExperience.position}
                    onChange={(e) =>
                      setNewExperience({ ...newExperience, position: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={newExperience.duration}
                    onChange={(e) =>
                      setNewExperience({ ...newExperience, duration: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Description"
                    value={newExperience.description}
                    onChange={(e) =>
                      setNewExperience({ ...newExperience, description: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddExperience}
                sx={{ mt: 2 }}
              >
                Add Experience
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Grid container spacing={2}>
              {profile?.education.map((edu, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{edu.degree}</Typography>
                    <Typography variant="subtitle2">{edu.institution}</Typography>
                    <Typography variant="body2">{edu.year}</Typography>
                    <Typography variant="body2">{edu.description}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Institution"
                    value={newEducation.institution}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, institution: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    value={newEducation.degree}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, degree: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={newEducation.year}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, year: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Description"
                    value={newEducation.description}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, description: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddEducation}
                sx={{ mt: 2 }}
              >
                Add Education
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              sx={{ mt: 2 }}
            >
              {saving ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 