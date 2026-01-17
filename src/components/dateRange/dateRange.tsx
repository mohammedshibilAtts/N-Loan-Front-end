import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Popover } from "@mui/material";
import { Icon } from "@iconify/react";

interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangeProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  disableInitialRange?: boolean;
}

export default function DateRange({ value, onChange, disableInitialRange }: DateRangeProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);

  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    return d;
  };

  const [tempRange, setTempRange] = useState<DateRangeValue>({
    startDate: value.startDate ? normalizeDate(value.startDate) : null,
    endDate: value.endDate ? normalizeDate(value.endDate) : null,
  });

  const open = Boolean(anchorEl);

  const getDefaultLast30Days = (): DateRangeValue => {
    const end = normalizeDate(new Date());
    const start = normalizeDate(new Date(end));
    start.setDate(start.getDate() - 29);
    return { startDate: start, endDate: end };
  };


  useEffect(() => {
    if (!value.startDate && !value.endDate && !disableInitialRange) {
      const range = getDefaultLast30Days();
      setTempRange(range);
      onChange(range);

      setCurrentMonth(range.startDate!.getMonth());
      setCurrentYear(range.startDate!.getFullYear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (value.startDate && value.endDate) {
      setTempRange({
        startDate: normalizeDate(value.startDate),
        endDate: normalizeDate(value.endDate),
      });
    }
  }, [value]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleDateClick = (date: Date) => {
    const selected = normalizeDate(date);

    if (selectingStart) {
      setTempRange({ startDate: selected, endDate: selected });
      setSelectingStart(false);
    } else {
      if (selected >= tempRange.startDate!) {
        onChange({
          startDate: tempRange.startDate,
          endDate: selected,
        });
        setAnchorEl(null);
        setSelectingStart(true);
      } else {
        setTempRange({ startDate: selected, endDate: selected });
      }
    }
  };

  const isInRange = (date: Date) => {
    const check = selectingStart ? value : tempRange;
    if (!check.startDate || !check.endDate) return false;
    return date >= check.startDate && date <= check.endDate;
  };

  const isStartDate = (date: Date) =>
    tempRange.startDate &&
    date.toDateString() === tempRange.startDate.toDateString();

  const isEndDate = (date: Date) =>
    tempRange.endDate &&
    date.toDateString() === tempRange.endDate.toDateString();

  const handleClose = () => {
    setAnchorEl(null);
    setSelectingStart(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (value.startDate) {
      setCurrentMonth(value.startDate.getMonth());
      setCurrentYear(value.startDate.getFullYear());
    }
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ height: 32 }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = normalizeDate(new Date(currentYear, currentMonth, day));

      const inRange = isInRange(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <Button
          key={day}
          onClick={() => handleDateClick(date)}
          sx={{
            minWidth: 3,
            width: 32,
            height: 30,
            borderRadius: "50%",
            fontSize: "0.875rem",
            padding: 0,
            backgroundColor: inRange
              ? "rgba(25, 118, 210, 0.1)"
              : "transparent",
            color: isStart || isEnd ? "white" : "inherit",
            fontWeight: isStart || isEnd ? 600 : 400,
            border: isToday && !inRange ? "2px solid #1976d2" : "none",
            "&:hover": {
              backgroundColor:
                isStart || isEnd
                  ? "#1565c0"
                  : inRange
                    ? "rgba(25, 118, 210, 0.2)"
                    : "rgba(0, 0, 0, 0.04)",
            },
            ...(isStart || isEnd
              ? {
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }
              : {}),
          }}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  const quickRanges = [
    {
      label: "Today",
      getValue: () => {
        const d = normalizeDate(new Date());
        return { startDate: d, endDate: d };
      },
    },
    {
      label: "Yesterday",
      getValue: () => {
        const d = normalizeDate(new Date());
        d.setDate(d.getDate() - 1);
        return { startDate: d, endDate: d };
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const end = normalizeDate(new Date());
        const start = normalizeDate(new Date(end));
        start.setDate(start.getDate() - 6);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const end = normalizeDate(new Date());
        const start = normalizeDate(new Date(end));
        start.setDate(start.getDate() - 29);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "This Month",
      getValue: () => {
        const now = new Date();
        return {
          startDate: normalizeDate(
            new Date(now.getFullYear(), now.getMonth(), 1)
          ),
          endDate: normalizeDate(
            new Date(now.getFullYear(), now.getMonth() + 1, 0)
          ),
        };
      },
    },
    {
      label: "Last Month",
      getValue: () => {
        const now = new Date();
        return {
          startDate: normalizeDate(
            new Date(now.getFullYear(), now.getMonth() - 1, 1)
          ),
          endDate: normalizeDate(
            new Date(now.getFullYear(), now.getMonth(), 0)
          ),
        };
      },
    },
  ];

  const handleQuickRange = (range: DateRangeValue) => {
    onChange(range);
    setAnchorEl(null);
    setSelectingStart(true);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => {
    currentMonth === 0
      ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
      : setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    currentMonth === 11
      ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
      : setCurrentMonth(currentMonth + 1);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        startIcon={<Icon icon="mdi:calendar-month" width={18} />}
        sx={{
          px: 2,
          py: 1.25,
          borderColor: "divider",
          borderRadius: 1,
          textTransform: "none",
          color: "text.primary",
          backgroundColor: "background.paper",
          fontWeight: 500,
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderColor: "divider",
          },
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {value.startDate && value.endDate
          ? `${formatDate(value.startDate)} to ${formatDate(value.endDate)}`
          : "Select date range"}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1,
              p: 2,
              width: 520,
              borderRadius: 2,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexDirection: "row-reverse" }}>
          {/* Quick Ranges Sidebar */}
          <Box
            sx={{
              width: 120,
              borderLeft: 1,
              borderColor: "divider",
              pr: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {quickRanges.map((range) => (
                <Button
                  key={range.label}
                  onClick={() => handleQuickRange(range.getValue())}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontSize: "0.813rem",
                    py: 0.75,
                    px: 1.5,
                    color: "text.primary",
                    fontWeight: 400,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Calendar Section */}
          <Box sx={{ flex: 1 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <IconButton
                size="small"
                onClick={prevMonth}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Icon icon="mdi:chevron-left" width={24} />
              </IconButton>
              <Typography variant="subtitle1" fontWeight={600}>
                {monthNames[currentMonth]} {currentYear}
              </Typography>
              <IconButton
                size="small"
                onClick={nextMonth}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Icon icon="mdi:chevron-right" width={24} />
              </IconButton>
            </Box>

            {/* Day labels */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
                mb: 1,
              }}
            >
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <Box
                  key={day}
                  sx={{
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    {day}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Calendar grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
              }}
            >
              {generateCalendar()}
            </Box>

            {/* Helper text */}
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {selectingStart ? "Select start date" : "Select end date"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
