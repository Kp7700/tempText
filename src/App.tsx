import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  PaletteMode,
  Box,
} from '@mui/material';
import { getAppTheme } from './theme';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HowItWorksDialog } from './components/HowItWorksDialog';
import { CreatePage } from './pages/CreatePage';
import { ViewPage } from './pages/ViewPage';

export default function App() {
  // Theme state persisted in localStorage
  const [mode, setMode] = useState<PaletteMode>(() => {
    try {
      const saved = localStorage.getItem('temptext_theme_mode');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('temptext_theme_mode', next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          id="app-root"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          <Header
            onToggleTheme={toggleTheme}
            onOpenHowItWorks={() => setHowItWorksOpen(true)}
          />

          <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<CreatePage />} />
              <Route path="/t/:id" element={<ViewPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          <Footer />

          <HowItWorksDialog
            open={howItWorksOpen}
            onClose={() => setHowItWorksOpen(false)}
          />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
