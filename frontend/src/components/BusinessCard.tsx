import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  QrCode as QrCodeIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface BusinessCard {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  qr_code: string;
}

export const BusinessCard: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  });

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/business-cards', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCard(data);
      setFormData({
        name: data.name || '',
        title: data.title || '',
        company: data.company || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Error fetching business card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3000/api/business-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setCard(data);
      setEditing(false);
    } catch (error) {
      console.error('Error saving business card:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${card?.name}'s Business Card`,
        text: `Check out ${card?.name}'s digital business card`,
        url: `${window.location.origin}/card/${card?.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
          Digital Business Card
        </Typography>

        {editing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setEditing(false)}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {card?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {card?.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {card?.company}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {card?.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {card?.phone}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {card?.website}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {card?.address}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                color="primary"
                onClick={() => setEditing(true)}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => window.open(`/card/${card?.id}/qr`, '_blank')}
                aria-label="qr code"
              >
                <QrCodeIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={handleShare}
                aria-label="share"
              >
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        )}
      </Paper>
    </Container>
  );
}; 