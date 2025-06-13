import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  qrCode: string;
}

export const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
  open,
  onClose,
  qrCode,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Your Business Card QR Code</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <img src={qrCode} alt="Business Card QR Code" style={{ maxWidth: '100%' }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => {
            const link = document.createElement('a');
            link.href = qrCode;
            link.download = 'business-card-qr.png';
            link.click();
          }}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 