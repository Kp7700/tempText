import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Link as LinkIcon,
  Shield,
  FileText,
  AlertCircle,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Code,
  Eye,
  Edit3,
  Columns,
} from 'lucide-react';
import { ExpirationDuration, LinkCreationResult } from '../types';
import { MAX_TEXT_LENGTH } from '../utils/duration';
import { createTemporaryTextRecord } from '../services/firebase';
import { renderMarkdownToHtml } from '../utils/markdown';
import { DurationSelector } from './DurationSelector';

interface CreateTextFormProps {
  onSuccess: (result: LinkCreationResult) => void;
}

type EditorTab = 'write' | 'preview' | 'split';

export const CreateTextForm: React.FC<CreateTextFormProps> = ({ onSuccess }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [text, setText] = useState('');
  const [duration, setDuration] = useState<ExpirationDuration>('1h');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<EditorTab>('write');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const characterCount = text.length;
  const isOverLimit = characterCount > MAX_TEXT_LENGTH;
  const isApproachingLimit = characterCount > MAX_TEXT_LENGTH * 0.9;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;

  // Insert markdown syntax helper
  const handleInsertSyntax = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText((prev) => prev + prefix + defaultText + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const replacement = selectedText || defaultText;
    const newText = text.substring(0, start) + prefix + replacement + suffix + text.substring(end);

    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + replacement.length
      );
    }, 0);
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setErrorMessage('Please enter some text before generating a link.');
      return;
    }

    if (isOverLimit) {
      setErrorMessage(
        `Your text exceeds the maximum allowed limit of ${MAX_TEXT_LENGTH.toLocaleString()} characters.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createTemporaryTextRecord(text, duration);
      onSuccess(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while creating the link. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeMode: EditorTab = isDesktop ? viewMode : viewMode === 'split' ? 'write' : viewMode;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Banner */}
      <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3.5 } }}>
        <Typography
          id="main-heading-title"
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
            mb: 1,
            letterSpacing: '-0.02em',
          }}
        >
          Share text temporarily
        </Typography>
        <Typography
          id="main-heading-subtitle"
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: 640, mx: 'auto', px: 1 }}
        >
          Paste or write text, notes, or code. Generate an expiring link that vanishes automatically.
        </Typography>
      </Box>

      {/* Main Wide Card */}
      <Card id="create-text-card" elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleGenerateLink} noValidate>
            {errorMessage && (
              <Alert
                id="create-error-alert"
                severity="error"
                icon={<AlertCircle size={20} />}
                onClose={() => setErrorMessage(null)}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {errorMessage}
              </Alert>
            )}

            {/* Top Toolbar: Left (Formatting shortcuts) & Right (Write / Preview / Split toggle) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5,
                mb: 1.5,
                pb: 1.5,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* Markdown Action Shortcuts */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mr: 1,
                    display: { xs: 'none', sm: 'inline' },
                  }}
                >
                  Formatting:
                </Typography>
                <Tooltip title="Bold (**text**)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('**', '**', 'bold text')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Bold text"
                  >
                    <Bold size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Italic (*text*)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('*', '*', 'italic text')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Italic text"
                  >
                    <Italic size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Heading (## Heading)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('## ', '', 'Heading')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Heading"
                  >
                    <Heading size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Bullet List (- item)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('- ', '', 'List item')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Bullet list"
                  >
                    <List size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Numbered List (1. item)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('1. ', '', 'First item')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Numbered list"
                  >
                    <ListOrdered size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Quote (> quote)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('> ', '', 'Quoted text')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Blockquote"
                  >
                    <Quote size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Inline Code (`code`)">
                  <IconButton
                    size="small"
                    onClick={() => handleInsertSyntax('`', '`', 'code')}
                    sx={{ p: 0.75, borderRadius: 1.5 }}
                    aria-label="Inline code"
                  >
                    <Code size={16} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* View Mode Toggle */}
              <ToggleButtonGroup
                id="editor-mode-toggle"
                value={activeMode}
                exclusive
                onChange={(_, next) => {
                  if (next) setViewMode(next);
                }}
                size="small"
                aria-label="Editor View Mode"
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
                    gap: 0.75,
                    borderRadius: 2,
                  },
                }}
              >
                <ToggleButton value="write" aria-label="Write Mode">
                  <Edit3 size={15} />
                  Write
                </ToggleButton>
                <ToggleButton value="preview" aria-label="Preview Mode">
                  <Eye size={15} />
                  Preview
                </ToggleButton>
                {isDesktop && (
                  <ToggleButton value="split" aria-label="Split View Mode">
                    <Columns size={15} />
                    Split
                  </ToggleButton>
                )}
              </ToggleButtonGroup>
            </Box>

            {/* Editor & Preview Area - Full Width, High Comfort */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: activeMode === 'split' ? { xs: '1fr', md: '1fr 1fr' } : '1fr',
                  gap: 2.5,
                  alignItems: 'stretch',
                }}
              >
                {/* Writing Column (shown in 'write' or 'split') */}
                {(activeMode === 'write' || activeMode === 'split') && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {activeMode === 'split' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Edit3 size={15} className="text-indigo-500" />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          EDITOR (MARKDOWN / TEXT)
                        </Typography>
                      </Box>
                    )}
                    <TextField
                      id="temp-text-input"
                      name="temp-text-input"
                      multiline
                      minRows={isDesktop ? 5 : 4}
                      maxRows={isDesktop ? 16 : 11}
                      fullWidth
                      placeholder={`Paste or type your text here...\n\nSupports Markdown:\n# Heading 1\n## Subheading\n**Bold text**, *Italic text*\n- Bullet lists\n1. Numbered items\n> Quotes\n\`inline code\` and code blocks`}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={isSubmitting}
                      error={isOverLimit}
                      inputRef={textareaRef}
                      slotProps={{
                        htmlInput: {
                          'aria-label': 'Temporary text input',
                          style: {
                            fontFamily:
                              'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
                            fontSize: '0.95rem',
                            lineHeight: 1.7,
                            resize: 'none',
                            minHeight: isDesktop ? '135px' : '110px',
                            maxHeight: isDesktop ? '420px' : '300px',
                            overflowY: 'auto',
                            transition: 'height 180ms ease',
                          },
                        },
                      }}
                      sx={{
                        width: '100%',
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          p: { xs: 1.75, sm: 2.25 },
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(0, 0, 0, 0.25)'
                              : 'rgba(0, 0, 0, 0.015)',
                          transition: 'box-shadow 200ms ease, border-color 200ms ease',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Preview Column (shown in 'preview' or 'split') */}
                {(activeMode === 'preview' || activeMode === 'split') && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {activeMode === 'split' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Eye size={15} className="text-teal-500" />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          LIVE FORMATTED PREVIEW
                        </Typography>
                      </Box>
                    )}
                    <Box
                      id="live-markdown-preview"
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 3,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(0, 0, 0, 0.3)'
                            : 'rgba(255, 255, 255, 0.7)',
                        minHeight: isDesktop ? '135px' : '110px',
                        maxHeight: activeMode === 'split' ? '420px' : { xs: '320px', sm: '500px' },
                        overflowY: 'auto',
                        width: '100%',
                        flexGrow: 1,
                        transition: 'height 180ms ease',
                      }}
                    >
                      {text.trim() ? (
                        <div
                          className="temptext-markdown"
                          dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(text) }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            minHeight: isDesktop ? '120px' : '100px',
                            color: 'text.secondary',
                            textAlign: 'center',
                            px: 2,
                            py: 3,
                          }}
                        >
                          <FileText size={36} className="text-slate-400 mb-2 opacity-50" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Your formatted preview will appear here
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            Supports headings, bold, italic, quotes, lists, and code.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Status and Hints Bar */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1,
                  mt: 1.5,
                  px: 0.5,
                }}
              >
                {/* Markdown Hint Required by UX Specification */}
                <Typography
                  id="markdown-support-hint"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Supports Markdown:</span> # heading, **bold**, *italic*, - lists, &gt; quote, `code`
                </Typography>

                {/* Counters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {lineCount > 0 && (
                    <Chip
                      label={`${lineCount} line${lineCount === 1 ? '' : 's'}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, fontSize: '0.75rem' }}
                    />
                  )}
                  {wordCount > 0 && (
                    <Chip
                      label={`${wordCount.toLocaleString()} words`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, fontSize: '0.75rem' }}
                    />
                  )}
                  <Typography
                    id="character-counter"
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: isOverLimit
                        ? 'error.main'
                        : isApproachingLimit
                        ? 'warning.main'
                        : 'text.secondary',
                    }}
                  >
                    {characterCount.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} chars
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bottom Options & Action Area */}
            <Box
              sx={{
                mt: 3,
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
                  gap: 2.5,
                  alignItems: 'center',
                }}
              >
                {/* Expiration Duration Selector */}
                <Box>
                  <DurationSelector
                    value={duration}
                    onChange={setDuration}
                    disabled={isSubmitting}
                  />
                </Box>

                {/* Generate Button & Safety Text */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    id="generate-link-btn"
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting || !text.trim() || isOverLimit}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <LinkIcon size={20} />
                      )
                    }
                    sx={{
                      py: 1.35,
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderRadius: 2.5,
                    }}
                  >
                    {isSubmitting ? 'Generating Secure Link...' : 'Generate Expiring Link'}
                  </Button>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.75,
                      color: 'text.secondary',
                    }}
                  >
                    <Shield size={14} className="text-emerald-500" />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                      Database access is permanently denied upon expiration.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
