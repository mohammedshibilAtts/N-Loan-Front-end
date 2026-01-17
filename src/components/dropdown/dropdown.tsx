import React from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";

interface DropDownProps {
  label?: string;
  name?: string;
  value: any;
  options: any[];
  onChange: (event: any) => void;
  optionLabel?: string;
  optionValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  name,
  value,
  options = [],
  onChange,
  optionLabel = "label",
  optionValue = "value",
  disabled = false,
  required = false,
  error = false,
  helperText = "",
  fullWidth = true,
  size = "small",
}) => {
  // find selected option object
  const selectedOption =
    options.find((opt) => opt[optionValue] === value) || null;

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <Autocomplete
        size={size}
        disabled={disabled}
        options={options}
        value={selectedOption}
        clearOnEscape
        getOptionLabel={(option: any) => option?.[optionLabel] || ""}
        isOptionEqualToValue={(option, val) =>
          option?.[optionValue] === val?.[optionValue]
        }
        onChange={(_, newValue) => {
          onChange({
            target: {
              name,
              value: newValue ? newValue[optionValue] : null
            },
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            error={error}
          />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DropDown;
