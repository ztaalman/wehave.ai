import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import type { BusinessCard, BusinessCardInput } from '../services/businessCard';
import { businessCardService } from '../services/businessCard';

interface BusinessCardFormProps {
  onSave: (card: BusinessCard) => void;
  onCancel: () => void;
  initialData?: BusinessCard;
}

export const BusinessCardForm: React.FC<BusinessCardFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BusinessCardInput>({
    name: initialData?.name || '',
    title: initialData?.title || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    address: initialData?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const card = await businessCardService.createOrUpdateCard(formData);
      onSave(card);
    } catch (error) {
      console.error('Error saving business card:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {initialData ? 'Edit Business Card' : 'Create Business Card'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {initialData ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}; 