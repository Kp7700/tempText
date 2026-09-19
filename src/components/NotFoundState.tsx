import React from 'react';
import { Card, CardContent, Typography, Box, Button, Alert } from '@mui/material';
import { SearchX, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%', textAlign: 'center', py: { xs: 2, sm: 4 } }}>
      <Card id="not-found-card" elevation={0}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(148, 163, 184, 0.15)'
                  : 'rgba(148, 163, 184, 0.1)',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <SearchX size={34} />
          </Box>

          <Typography
            id="not-found-title"
            variant="h5"
            component="h1"
            color="text.primary"
            sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.01em' }}
          >
            Link not found
          </Typography>

          <Typography
            id="not-found-description"
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            The link you requested does not exist or may have been deleted.
          </Typography>

          <Alert
            severity="info"
            sx={{
              mb: 4,
              textAlign: 'left',
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.875rem' },
            }}
          >
            Please verify the exact URL in your browser address bar. TempText URLs are case-sensitive.
          </Alert>

          <Button
            id="not-found-create-btn"
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
