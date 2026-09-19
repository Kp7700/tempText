import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import { RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';
import { fetchTemporaryTextRecord } from '../services/firebase';
import { TemporaryTextRecord, FetchStatus } from '../types';
import { ViewTextCard } from '../components/ViewTextCard';
import { ExpiredState } from '../components/ExpiredState';
import { NotFoundState } from '../components/NotFoundState';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<FetchStatus>('loading');
  const [record, setRecord] = useState<TemporaryTextRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set noindex meta tags for ephemeral content privacy
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  const loadRecord = useCallback(async () => {
    if (!id) {
      setStatus('not_found');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    const result = await fetchTemporaryTextRecord(id);
    setStatus(result.status);

    if (result.status === 'active' && result.data) {
      setRecord(result.data);
    } else if (result.status === 'error') {
      setErrorMessage(result.errorMessage || 'Failed to load the temporary text record.');
    }
  }, [id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const handleExpire = useCallback(() => {
    // When countdown hits 0 or time elapses, remove text from memory and show ExpiredState
    setRecord(null);
    setStatus('expired');
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {status === 'loading' && (
        <Box
          id="loading-view-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: 2.5,
          }}
        >
          <CircularProgress size={48} thickness={4} color="primary" />
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Verifying link and retrieving temporary text...
          </Typography>
        </Box>
      )}

      {status === 'active' && record && (
        <ViewTextCard record={record} onExpire={handleExpire} />
      )}

      {status === 'expired' && <ExpiredState />}

      {status === 'not_found' && <NotFoundState />}

      {status === 'error' && (
        <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%', py: 4 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: { xs: 3, sm: 4.5 }, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
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
                  mb: 2,
                }}
              >
                <ShieldAlert size={28} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Unable to Load Content
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {errorMessage || 'A network or verification error occurred.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowLeft size={16} />}
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </Button>
                <Button
                  variant="contained"
                  startIcon={<RefreshCw size={16} />}
                  onClick={loadRecord}
                >
                  Retry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};
