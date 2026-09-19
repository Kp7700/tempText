import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { CreateTextForm } from '../components/CreateTextForm';
import { ResultCard } from '../components/ResultCard';
import { LinkCreationResult } from '../types';

export const CreatePage: React.FC = () => {
  const [createdResult, setCreatedResult] = useState<LinkCreationResult | null>(null);

  const handleSuccess = (result: LinkCreationResult) => {
    setCreatedResult(result);
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAnother = () => {
    setCreatedResult(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {createdResult ? (
        <ResultCard result={createdResult} onCreateAnother={handleCreateAnother} />
      ) : (
        <CreateTextForm onSuccess={handleSuccess} />
      )}
    </Container>
  );
};
