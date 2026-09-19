import React from 'react';
import { Card, CardContent, Typography, Box, Button, Alert } from '@mui/material';
import { Clock, PlusCircle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExpiredState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%', textAlign: 'center', py: { xs: 2, sm: 4 } }}>
      <Card id="expired-card" elevation={0}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(239, 68, 68, 0.1)',
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <Clock size={34} />
          </Box>

          <Typography
            id="expired-title"
            variant="h5"
            component="h1"
            color="text.primary"
            sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.01em' }}
          >
            This link has expired
          </Typography>

          <Typography
            id="expired-description"
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            The content is no longer available.
          </Typography>

          <Alert
            severity="warning"
            icon={<ShieldAlert size={20} />}
            sx={{
              mb: 4,
              textAlign: 'left',
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.875rem' },
            }}
          >
            As configured by its creator, this temporary note reached its expiration timestamp and has been sealed. Its content cannot be viewed or recovered.
          </Alert>

          <Button
            id="expired-create-new-btn"
            variant="contained"
            size="large"
            startIcon={<PlusCircle size={18} />}
            onClick={() => navigate('/')}
            sx={{ fontWeight: 700, px: 4, py: 1.25 }}
          >
            Create a New TempText
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
