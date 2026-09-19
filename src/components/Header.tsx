import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Container,
  Tooltip,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Sun,
  Moon,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleTheme: () => void;
  onOpenHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, onOpenHowItWorks }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme.palette.mode === 'dark';

  const isHome = location.pathname === '/';

  return (
    <AppBar position="sticky" elevation={0} id="main-app-bar">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1, minHeight: 64, justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <Box
            id="brand-logo-button"
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                bgcolor: 'primary.main',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (theme) =>
                  `0 2px 10px ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.4)'
                      : 'rgba(79, 70, 229, 0.25)'
                  }`,
              }}
            >
              <Clock size={20} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                TempText
              </Typography>
              <Chip
                label="Self-Expiring"
                size="small"
                variant="outlined"
                color="primary"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              />
            </Box>
          </Box>

          {/* Action controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            {!isHome && (
              <Button
                id="header-create-new-btn"
                variant="outlined"
                size="small"
                onClick={() => navigate('/')}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderRadius: 2,
                }}
              >
                New Link
              </Button>
            )}

            <Button
              id="header-how-it-works-btn"
              variant="text"
              color="inherit"
              size="small"
              startIcon={<HelpCircle size={17} />}
              onClick={onOpenHowItWorks}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              How it works
            </Button>

            <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
              <IconButton
                id="theme-toggle-button"
                onClick={onToggleTheme}
                color="inherit"
                aria-label="toggle light or dark theme"
                sx={{
                  p: 1,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
