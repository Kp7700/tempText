import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  PlusCircle,
  Clock,
  Calendar,
  Check,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { LinkCreationResult } from '../types';
import { formatDateTime } from '../utils/duration';
import { renderMarkdownToHtml } from '../utils/markdown';

interface ResultCardProps {
  result: LinkCreationResult;
  onCreateAnother: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onCreateAnother }) => {
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.getElementById('generated-link-input') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setSnackbarOpen(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleOpenLink = () => {
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card id="result-card" elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 5 } }}>
          {/* Header Banner */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3.5,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                bgcolor: 'success.main',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
              }}
            >
              <CheckCircle2 size={30} />
            </Box>
            <Box>
              <Typography
                id="result-heading"
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  fontSize: { xs: '1.35rem', sm: '1.65rem' },
                }}
              >
                Your temporary link is ready!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Anyone with this URL can view this text until it automatically expires.
              </Typography>
            </Box>
          </Box>

          {/* Generated URL Box */}
          <Box sx={{ mb: 3.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 1, display: 'block' }}
            >
              SHAREABLE URL
            </Typography>
            <TextField
              id="generated-link-input"
              fullWidth
              value={result.url}
              slotProps={{
                input: {
                  readOnly: true,
                  style: {
                    fontFamily: 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copied ? 'Copied!' : 'Copy Link'}>
                        <IconButton
                          id="copy-icon-btn"
                          onClick={handleCopyLink}
                          edge="end"
                          color={copied ? 'success' : 'primary'}
                          aria-label="Copy generated URL"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(0, 0, 0, 0.35)'
                      : 'rgba(79, 70, 229, 0.04)',
                  borderColor: 'primary.main',
                },
              }}
            />
          </Box>

          {/* Metadata Highlights */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.025)'
                  : 'rgba(0, 0, 0, 0.02)',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
              mb: 3.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Clock size={22} className="text-amber-500" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                  Active Duration
                </Typography>
                <Chip
                  id="result-duration-chip"
                  label={result.durationLabel}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600, mt: 0.25 }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Calendar size={22} className="text-indigo-500" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                  Expires On
                </Typography>
                <Typography
                  id="result-expiration-datetime"
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 600 }}
                >
                  {formatDateTime(result.expiresAtDate)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Primary Action Buttons */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr 1fr' },
              gap: 1.5,
              mb: 4,
            }}
          >
            <Button
              id="copy-link-btn"
              variant="contained"
              size="large"
              startIcon={copied ? <Check size={18} /> : <Copy size={18} />}
              onClick={handleCopyLink}
              color={copied ? 'success' : 'primary'}
              sx={{ py: 1.35, fontWeight: 700, borderRadius: 2.5 }}
            >
              {copied ? 'Link Copied!' : 'Copy Link'}
            </Button>

            <Button
              id="open-link-btn"
              variant="outlined"
              size="large"
              startIcon={<ExternalLink size={18} />}
              onClick={handleOpenLink}
              sx={{ py: 1.35, fontWeight: 600, borderRadius: 2.5 }}
            >
              Open Link
            </Button>

            <Button
              id="create-another-btn"
              variant="text"
              size="large"
              startIcon={<PlusCircle size={18} />}
              onClick={onCreateAnother}
              sx={{ py: 1.35, fontWeight: 600, borderRadius: 2.5, color: 'text.secondary' }}
            >
              Create Another
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Verification Preview Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <FileText size={18} className="text-indigo-500" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Saved Content Preview
              </Typography>
              <Chip label="Markdown Rendered" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>

            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2.5,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.3)'
                    : 'rgba(0, 0, 0, 0.02)',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                maxHeight: '350px',
                overflowY: 'auto',
              }}
            >
              <div
                className="temptext-markdown"
                dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(result.text || '') }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar notification */}
      <Snackbar
        id="copy-snackbar"
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          Link copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
};
