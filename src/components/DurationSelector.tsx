import React, { useState, useRef, KeyboardEvent } from 'react';
import {
  Box,
  Typography,
  Chip,
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Clock, ChevronDown, Check } from 'lucide-react';
import { ExpirationDuration } from '../types';
import { DURATION_OPTIONS, getDurationOption } from '../utils/duration';

interface DurationSelectorProps {
  value: ExpirationDuration;
  onChange: (value: ExpirationDuration) => void;
  disabled?: boolean;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const currentOption = getDurationOption(value);

  const handleOpen = () => {
    if (disabled) return;
    setAnchorEl(triggerRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Only deliberate clicks or taps select an option
  const handleSelect = (optionValue: ExpirationDuration) => {
    onChange(optionValue);
    handleClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Label and Section Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Clock size={16} className="text-amber-500" />
        <Typography
          variant="subtitle2"
          component="label"
          id="duration-selector-label"
          sx={{ fontWeight: 600, color: 'text.primary', userSelect: 'none' }}
        >
          Self-Destruct Duration
        </Typography>
      </Box>

      {/* Controlled Trigger Button */}
      <Box
        id="duration-select-trigger"
        ref={triggerRef}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="duration-selector-label"
        aria-controls={isOpen ? 'duration-options-list' : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          p: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.75, sm: 2 },
          borderRadius: 2.5,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          border: (theme) =>
            `1px solid ${
              isOpen
                ? theme.palette.primary.main
                : theme.palette.divider
            }`,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(255, 255, 255, 0.8)',
          boxShadow: (theme) =>
            isOpen
              ? `0 0 0 2px ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(99, 102, 241, 0.3)'
                    : 'rgba(79, 70, 229, 0.2)'
                }`
              : 'none',
          transition: 'border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease',
          '&:hover': {
            borderColor: (theme) => (disabled ? theme.palette.divider : theme.palette.primary.main),
            bgcolor: (theme) =>
              disabled
                ? undefined
                : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.015)',
          },
          '&:focus-visible': {
            outline: 'none',
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.light}40`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, mr: 1 }}>
          <Typography
            id="duration-selected-label"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              color: 'text.primary',
              whiteSpace: 'nowrap',
            }}
          >
            {currentOption.label}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: { xs: 'none', sm: 'inline' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
            }}
          >
            — {currentOption.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Chip
            id="duration-selected-badge"
            label={currentOption.shortLabel}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 22, fontSize: '0.75rem', fontWeight: 700 }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <ChevronDown size={18} />
          </Box>
        </Box>
      </Box>

      {/* Controlled Popover Menu */}
      {/* Placement strictly below trigger, autoFocus disabled so mouse position never selects an option */}
      <Popover
        id="duration-options-popover"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableAutoFocus={true}
        disableEnforceFocus={true}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : 'auto',
              minWidth: { xs: '280px', sm: '320px' },
              maxWidth: '460px',
              maxHeight: '340px',
              borderRadius: 2.5,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              overflowY: 'auto',
              p: 0.5,
            },
          },
        }}
        transitionDuration={300}
      >
        <List
          id="duration-options-list"
          role="listbox"
          aria-labelledby="duration-selector-label"
          sx={{ p: 0 }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              handleClose();
              triggerRef.current?.focus();
            }
          }}
        >
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <ListItemButton
                key={opt.value}
                id={`duration-option-${opt.value}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(opt.value);
                    triggerRef.current?.focus();
                  }
                }}
                sx={{
                  py: 1.15,
                  px: 1.5,
                  my: 0.25,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    isSelected
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.22)'
                        : 'rgba(79, 70, 229, 0.09)'
                      : 'transparent',
                  // Hover styling ONLY provides a gentle background feedback after delay
                  // It NEVER modifies selected value
                  transition: 'background-color 150ms ease',
                  '&:hover': {
                    bgcolor: (theme) =>
                      isSelected
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(99, 102, 241, 0.28)'
                          : 'rgba(79, 70, 229, 0.13)'
                        : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {isSelected ? (
                    <Check size={18} className="text-indigo-600 font-bold" />
                  ) : (
                    <Box sx={{ width: 18 }} />
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {opt.label}
                      </Typography>
                      <Chip
                        label={opt.shortLabel}
                        size="small"
                        variant={isSelected ? 'filled' : 'outlined'}
                        color={isSelected ? 'primary' : 'default'}
                        sx={{
                          height: 20,
                          fontSize: '0.725rem',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.25 }}
                    >
                      {opt.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Popover>
    </Box>
  );
};
