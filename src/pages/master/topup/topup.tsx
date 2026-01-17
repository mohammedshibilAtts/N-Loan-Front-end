import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Stack,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

import { Breadcrumb } from "../../../components/breadCrumbComp";
import { useNotificationConfig } from "./notificationHooks";

export default function NotificationSettings() {
  const { channels, setChannels, loading, saveConfig } =
    useNotificationConfig();

  const [activeTab, setActiveTab] = useState(0);

  /* ---------------- TAB CHANGE ---------------- */
  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  /* ---------------- TOGGLE EVENT ---------------- */
  const toggleEvent = (eventKey: string) => {
    setChannels((prev) =>
      prev.map((channel, index) =>
        index !== activeTab
          ? channel
          : {
              ...channel,
              events: channel.events.map((ev: any) =>
                ev.key === eventKey
                  ? { ...ev, enabled: !ev.enabled }
                  : ev
              ),
            }
      )
    );
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = () => {
    const payload = channels.reduce((acc: any, channel: any) => {
      acc[channel.channel] = {
        enabled: true,
        settings: channel.events.reduce((s: any, ev: any) => {
          s[ev.key] = ev.enabled;
          return s;
        }, {}),
      };
      return acc;
    }, {});

    saveConfig(payload);
  };

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Masters" },
          { label: "Notification Settings", active: true },
        ]}
      />

      <Paper sx={{ p: 3, mt: 3 }}>
        {/* ---------- TABS ---------- */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": { backgroundColor: "black" },
            "& .MuiTab-root.Mui-selected": {
              color: "black",
              fontWeight: 600,
            },
          }}
        >
          {channels.map((channel) => (
            <Tab key={channel.channel} label={channel.label} />
          ))}
        </Tabs>

        {/* ---------- EVENTS ---------- */}
        <Box sx={{ mt: 3 }}>
          {channels[activeTab]?.events?.map((event: any) => (
            <FormControlLabel
              key={event.key}
              control={
                <Checkbox
                  checked={event.enabled}
                  onChange={() => toggleEvent(event.key)}
                />
              }
              label={event.label}
              sx={{ minWidth: 250, padding: 1 }}
            />
          ))}
        </Box>

        {/* ---------- ACTIONS ---------- */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4, justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{ backgroundColor: "#000" }}
          >
            {loading ? <CircularProgress size={22} /> : "Save"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
