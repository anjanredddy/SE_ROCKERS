import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';
import { handleAxiosError, showSuccess } from '../../utils/errorHandler';

const Settings = () => {
  const [settings, setSettings] = useState({
    system_name: '',
    email: '',
    contact_number: '',
    address: '',
    enable_email_notifications: false,
    enable_sms_notifications: false,
    default_penalty_rate: 0,
    grace_period_days: 0
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSettings(response.data);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({
      ...settings,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/settings', settings);
      showSuccess('Settings updated successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              System Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="system_name"
              label="System Name"
              value={settings.system_name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="email"
              label="System Email"
              type="email"
              value={settings.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="contact_number"
              label="Contact Number"
              value={settings.contact_number}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Address"
              multiline
              rows={3}
              value={settings.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="default_penalty_rate"
              label="Default Penalty Rate (%)"
              type="number"
              value={settings.default_penalty_rate}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="grace_period_days"
              label="Grace Period (Days)"
              type="number"
              value={settings.grace_period_days}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="enable_email_notifications"
                  checked={settings.enable_email_notifications}
                  onChange={handleChange}
                />
              }
              label="Enable Email Notifications"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="enable_sms_notifications"
                  checked={settings.enable_sms_notifications}
                  onChange={handleChange}
                />
              }
              label="Enable SMS Notifications"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings;
