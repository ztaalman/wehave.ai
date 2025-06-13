import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { BusinessCardForm } from '../components/BusinessCardForm';
import { BusinessCardView } from '../components/BusinessCardView';
import { QRCodeDialog } from '../components/QRCodeDialog';

export const BusinessCardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/business-cards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business card');
      }

      const data = await response.json();
      setCardData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch business card');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/business-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save business card');
      }

      const savedData = await response.json();
      setCardData(savedData);
      setEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save business card');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Business Card',
          text: `Check out my business card: ${cardData.name} - ${cardData.title} at ${cardData.company}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleGenerateQRCode = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/business-cards/qr-code', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setCardData((prev: any) => ({ ...prev, qr_code: data.qr_code }));
      setShowQRCode(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate QR code');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Card
        </Typography>
        {editing ? (
          <BusinessCardForm
            initialData={cardData}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <BusinessCardView
            card={cardData}
            onEdit={() => setEditing(true)}
            onShare={handleShare}
            onShowQR={handleGenerateQRCode}
          />
        )}
      </Paper>
      <QRCodeDialog
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        qrCode={cardData?.qr_code}
      />
    </Container>
  );
}; 