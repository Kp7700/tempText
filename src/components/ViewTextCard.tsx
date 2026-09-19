import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Clock,
  Calendar,
  Copy,
  Check,
  PlusCircle,
  FileText,
  ShieldCheck,
  Eye,
  Code,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TemporaryTextRecord } from '../types';
import { formatCountdown, formatDateTime } from '../utils/duration';
import { renderMarkdownToHtml } from '../utils/markdown';

interface ViewTextCardProps {
  record: TemporaryTextRecord;
  onExpire: () => void;
}

export const ViewTextCard: React.FC<ViewTextCardProps> = ({ record, onExpire }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [viewFormat, setViewFormat] = useState<'formatted' | 'raw'>('formatted');
  const [countdown, setCountdown] = useState(() => formatCountdown(record.expiresAt));

  // Live countdown timer that checks every second
  useEffect(() => {
    const updateCountdown = () => {
      const current = formatCountdown(record.expiresAt);
      setCountdown(current);

      if (current.isExpired) {
        onExpire();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [record.expiresAt, onExpire]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(record.text);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = record.text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const lineCount = record.text.split(/\r\n|\r|\n/).length;
  const charCount = record.text.length;
  const wordCount = record.text.trim() ? record.text.trim().split(/\s+/).length : 0;
  const isUrgent = countdown.totalSecondsRemaining < 300;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Expiration Status Header Banner */}
      <Card
        id="view-text-header-card"
        elevation={0}
        sx={{
          mb: 2.5,
          width: '100%',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? isUrgent
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(99, 102, 241, 0.08)'
              : isUrgent
              ? 'rgba(239, 68, 68, 0.06)'
              : 'rgba(79, 70, 229, 0.04)',
          borderColor: (theme) =>
            isUrgent
              ? theme.palette.error.main
              : theme.palette.mode === 'dark'
              ? 'rgba(99, 102, 241, 0.25)'
              : 'rgba(79, 70, 229, 0.15)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}
          >
            {/* Live visual countdown */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: 2.5,
                  bgcolor: isUrgent ? 'error.main' : 'primary.main',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s',
                  boxShadow: (theme) =>
                    `0 2px 10px ${
                      isUrgent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)'
                    }`,
                }}
              >
                <Clock size={22} />
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', fontWeight: 700, letterSpacing: '0.05em' }}
                >
                  TIME REMAINING
                </Typography>
                <Typography
                  id="countdown-timer-display"
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    color: isUrgent ? 'error.main' : 'text.primary',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {countdown.text}
                </Typography>
              </Box>
            </Box>

            {/* Exact Expiration Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Calendar size={20} className="text-slate-400" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', fontWeight: 600 }}
                >
                  Auto-Destruct Time
                </Typography>
                <Typography
                  id="exact-expiration-timestamp"
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 600 }}
                >
                  {formatDateTime(record.expiresAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Wide Text Content Card */}
      <Card id="shared-text-card" elevation={0} sx={{ width: '100%', mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3.5, md: 4.5 } }}>
          {/* Toolbar: Stats on left, View Switcher & Copy Button on right */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1.5,
              mb: 2.5,
              pb: 2,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Left: Content title & stats */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <FileText size={20} className="text-indigo-500" />
              <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 700 }}>
                Shared Content
              </Typography>
              <Chip
                label={`${charCount.toLocaleString()} chars`}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600 }}
              />
              <Chip
                label={`${wordCount.toLocaleString()} words`}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.75rem' }}
              />
              <Chip
                label={`${lineCount} line${lineCount === 1 ? '' : 's'}`}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.75rem' }}
              />
            </Box>

            {/* Right: Format Toggle & Copy Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' }}>
              <ToggleButtonGroup
                id="view-format-toggle"
                value={viewFormat}
                exclusive
                onChange={(_, next) => {
                  if (next) setViewFormat(next);
                }}
                size="small"
                aria-label="Format View"
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 2,
                  '& .MuiToggleButton-root': {
                    px: 1.5,
                    py: 0.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    gap: 0.5,
                  },
                }}
              >
                <ToggleButton value="formatted" aria-label="Formatted Markdown View">
                  <Eye size={15} />
                  Formatted
                </ToggleButton>
                <ToggleButton value="raw" aria-label="Raw Plain Text View">
                  <Code size={15} />
                  Raw Text
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                id="copy-shared-text-btn"
                variant="contained"
                size="medium"
                startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopyText}
                color={copied ? 'success' : 'primary'}
                sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
              >
                {copied ? 'Copied' : 'Copy Text'}
              </Button>
            </Box>
          </Box>

          {/* Content Display Container - Spacious, High Minimum Height, Responsive Padding */}
          {viewFormat === 'formatted' ? (
            <Paper
              id="text-content-display"
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4 },
                borderRadius: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.35)'
                    : 'rgba(255, 255, 255, 0.85)',
                minHeight: '380px',
                maxHeight: '75vh',
                overflowY: 'auto',
                color: 'text.primary',
                userSelect: 'text',
                width: '100%',
              }}
            >
              <div
                className="temptext-markdown"
                dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(record.text) }}
              />
            </Paper>
          ) : (
            <Paper
              id="raw-text-content-display"
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4 },
                borderRadius: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.45)'
                    : 'rgba(0, 0, 0, 0.02)',
                fontFamily:
                  'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: '380px',
                maxHeight: '75vh',
                overflowY: 'auto',
                color: 'text.primary',
                userSelect: 'text',
                width: '100%',
              }}
            >
              {record.text}
            </Paper>
          )}

          {/* Bottom Security & Actions */}
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <ShieldCheck size={18} className="text-emerald-500" />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                Protected content. Expired links are permanently purged and inaccessible.
              </Typography>
            </Box>

            <Button
              id="view-create-new-btn"
              variant="outlined"
              size="medium"
              startIcon={<PlusCircle size={16} />}
              onClick={() => navigate('/')}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Create New TempText
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar notification */}
      <Snackbar
        id="text-copied-snackbar"
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
          Text copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
};
