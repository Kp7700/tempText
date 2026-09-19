import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Shield, Clock, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      id="app-footer"
      sx={{
        py: 4,
        mt: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(11, 17, 32, 0.5)'
            : 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={14} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
              TempText
            </Typography>
            <Typography variant="caption" color="text.secondary">
              — Ephemeral text sharing
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
              color: 'text.secondary',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Shield size={14} />
              <Typography variant="caption">Zero Logging</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Lock size={14} />
              <Typography variant="caption">Server-Enforced Expiration</Typography>
            </Box>
            <Typography variant="caption">
              No account required
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
