import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Edit3,
  Clock,
  Share2,
  Lock,
  Eye,
  Info,
} from 'lucide-react';

interface HowItWorksDialogProps {
  open: boolean;
  onClose: () => void;
}

export const HowItWorksDialog: React.FC<HowItWorksDialogProps> = ({ open, onClose }) => {
  const steps = [
    {
      step: '1',
      title: 'Enter your text',
      desc: 'Paste or type any message, confidential note, API key, log snippet, or memo.',
      icon: <Edit3 size={22} className="text-indigo-500" />,
    },
    {
      step: '2',
      title: 'Choose expiration duration',
      desc: 'Select how long the link should stay valid — from 5 minutes up to 1 year.',
      icon: <Clock size={22} className="text-amber-500" />,
    },
    {
      step: '3',
      title: 'Generate and share the link',
      desc: 'Receive a unique, cryptographically unpredictable URL to share with your recipient.',
      icon: <Share2 size={22} className="text-teal-500" />,
    },
    {
      step: '4',
      title: 'Automatic expiration enforcement',
      desc: 'Once the expiration timestamp passes, access is permanently blocked by database security rules.',
      icon: <Lock size={22} className="text-rose-500" />,
    },
  ];

  return (
    <Dialog
      id="how-it-works-dialog"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="how-it-works-title"
    >
      <DialogTitle id="how-it-works-title" sx={{ pb: 1, fontWeight: 700 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Info size={20} />
          </Box>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            How TempText Works
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          TempText lets you share text securely with built-in time-to-live expiration.
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((item) => (
            <ListItem
              key={item.step}
              disableGutters
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <ListItemIcon sx={{ minWidth: 44 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    {item.step}. {item.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2.5 }} />

        <Alert
          severity="info"
          icon={<Eye size={20} />}
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: '0.85rem' },
          }}
        >
          <strong>Public Link Notice:</strong> Anyone with the unique shareable link can access the text while it is active. After expiration, the link permanently stops providing access.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button id="how-it-works-close-btn" onClick={onClose} variant="contained">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};
