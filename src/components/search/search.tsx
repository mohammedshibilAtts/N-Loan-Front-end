import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface SearchProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  showClear?: boolean;
  loading?: boolean;
}

const Search: React.FC<SearchProps> = ({
  value = "",
  onSearch,
  placeholder = "Search",
  debounceMs = 500,
  fullWidth = true,
  disabled = false,
  showClear = true,
  loading = false,
}) => {
  const [input, setInput] = useState(value);

  // 🔁 Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [input, debounceMs, onSearch]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
      <TextField
        fullWidth={fullWidth}
        disabled={disabled}
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "0.875rem",
            borderRadius: 1,
            "& input": {
              py: 1.6,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon="mdi:magnify" width={18} />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              {/* 🔄 LOADING SPINNER */}
              {loading && <CircularProgress size={18} />}

              {/* ❌ CLEAR ICON */}
              {!loading && showClear && input && (
                <IconButton size="small" onClick={() => setInput("")}>
                  <Icon icon="mdi:close-circle" width={18} />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default Search;
