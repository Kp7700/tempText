import { createTheme, PaletteMode, ThemeOptions } from '@mui/material';

export const getAppTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: isDark ? '#818cf8' : '#4f46e5', // Indigo-600 / Indigo-400
        light: isDark ? '#a5b4fc' : '#6366f1',
        dark: isDark ? '#6366f1' : '#3730a3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#2dd4bf' : '#0d9488', // Teal
        light: isDark ? '#5eead4' : '#14b8a6',
        dark: isDark ? '#0f766e' : '#042f2e',
      },
      background: {
        default: isDark ? '#090d16' : '#f8fafc',
        paper: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      error: {
        main: isDark ? '#f87171' : '#dc2626',
      },
      warning: {
        main: isDark ? '#fbbf24' : '#d97706',
      },
      info: {
        main: isDark ? '#38bdf8' : '#0284c7',
      },
      success: {
        main: isDark ? '#4ade80' : '#16a34a',
      },
    },
    typography: {
      fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 600, letterSpacing: '-0.015em' },
      h4: { fontWeight: 600, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontSize: '1.05rem', lineHeight: 1.5 },
      subtitle2: { fontWeight: 500 },
      body1: { fontSize: '0.975rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 20px',
            fontSize: '0.925rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)'}`,
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#0b1120' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
