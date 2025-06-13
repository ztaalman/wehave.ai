import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import type { BusinessCard } from '../services/businessCard';

interface BusinessCardViewProps {
  card: BusinessCard;
  onEdit: () => void;
  onShare: () => void;
  onShowQR: () => void;
}

export const BusinessCardView: React.FC<BusinessCardViewProps> = ({
  card,
  onEdit,
  onShare,
  onShowQR,
}) => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h2">
            {card.name}
          </Typography>
          <Box>
            <IconButton onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={onShare} color="primary">
              <ShareIcon />
            </IconButton>
            <IconButton onClick={onShowQR} color="primary">
              <QrCodeIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              {card.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {card.company}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1">
              <strong>Email:</strong> {card.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {card.phone}
            </Typography>
            {card.website && (
              <Typography variant="body1">
                <strong>Website:</strong>{' '}
                <a href={card.website} target="_blank" rel="noopener noreferrer">
                  {card.website}
                </a>
              </Typography>
            )}
            {card.address && (
              <Typography variant="body1">
                <strong>Address:</strong> {card.address}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}; 