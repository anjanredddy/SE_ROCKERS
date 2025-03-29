import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { handleAxiosError, showSuccess } from '../../utils/errorHandler';
import ChangePasswordDialog from '../users/ChangePasswordDialog';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      showSuccess('Profile updated successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
                bgcolor: 'primary.main'
              }}
            >
              {user?.firstname?.[0]}
            </Avatar>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="firstname"
              label="First Name"
              value={formData.firstname}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="lastname"
              label="Last Name"
              value={formData.lastname}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Update Profile
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenPasswordDialog(true)}
              >
                Change Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <ChangePasswordDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        userId={user?.id}
      />
    </Box>
  );
};

export default Profile;
