import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Popover } from "@mui/material";
import { Icon } from "@iconify/react";

interface SingleDateProps {
    value: Date | null;
    onChange: (date: Date) => void;
}

export default function SingleDate({ value, onChange }: SingleDateProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const normalizeDate = (date: Date) => {
        const d = new Date(date);
        d.setHours(12, 0, 0, 0); // 🔥 FIX: prevent timezone shift
        return d;
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (value) {
            if (open) {
                setCurrentMonth(value.getMonth())
                setCurrentYear(value.getFullYear())
            }
        }
    }, [value, open]);


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
        onChange(selected);
        setAnchorEl(null);
    };

    const isSelected = (date: Date) => {
        if (!value) return false;
        return date.toDateString() === normalizeDate(value).toDateString();
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        if (value) {
            setCurrentMonth(value.getMonth());
            setCurrentYear(value.getFullYear());
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

            const selected = isSelected(date);
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
                        backgroundColor: selected
                            ? "rgba(25, 118, 210, 0.1)"
                            : "transparent",
                        color: selected ? "white" : "inherit",
                        fontWeight: selected ? 600 : 400,
                        border: isToday && !selected ? "2px solid #1976d2" : "none",
                        "&:hover": {
                            backgroundColor:
                                selected
                                    ? "#1565c0"
                                    : selected
                                        ? "rgba(25, 118, 210, 0.2)"
                                        : "rgba(0, 0, 0, 0.04)",
                        },
                        ...(selected
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
                return d;
            },
        },
        {
            label: "Yesterday",
            getValue: () => {
                const d = normalizeDate(new Date());
                d.setDate(d.getDate() - 1);
                return d;
            },
        },
    ];

    const handleQuickRange = (date: Date) => {
        onChange(date);
        setAnchorEl(null);
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
                {value
                    ? `${formatDate(value)}`
                    : "Select date"}
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
                                Select date
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
}
