import React from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

interface DateRange {
  start: string;
  end: string;
}

interface DateFilterDropdownProps {
  value: string;
  onChange: (option: string, range: DateRange) => void;
}

const formatDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const getFormattedDateRange = (option: string): DateRange => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  let start: Date, end: Date;

  switch (option) {
    case 'today':
      start = new Date(year, month, date);
      end = new Date(year, month, date);
      break;

    case 'thisWeek': {
      const day = now.getDay(); // 0 = Sunday
      start = new Date(year, month, date - day);
      end = new Date(year, month, date + (6 - day));
      break;
    }

    case 'thisMonth':
      start = new Date(year, month, 1);
      end = new Date(year, month + 1, 0);
      break;

    case 'thisYear':
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31);
      break;

    default:
      start = end = now;
  }

  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

const DateFilter: React.FC<DateFilterDropdownProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    const range = getFormattedDateRange(selected);
    onChange(selected, range);
  };

  return (
    <FormControl fullWidth size="small">
      
      <Select value={value}  onChange={handleChange} >
        <MenuItem value="today">Today</MenuItem>
        <MenuItem value="thisWeek">This Week</MenuItem>
        <MenuItem value="thisMonth">This Month</MenuItem>
        <MenuItem value="thisYear">This Year</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DateFilter;