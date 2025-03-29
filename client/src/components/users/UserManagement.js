import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Chip
} from '@mui/material';
import { Edit, Delete, Add, Lock } from '@mui/icons-material';
import axios from 'axios';
import UserForm from './USerForm';
import ChangePasswordDialog from './ChangePasswordDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedUser(null);
            setOpenForm(true);
          }}
        >
          New User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status ? 'Active' : 'Inactive'}
                    color={user.status ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenPasswordDialog(true);
                    }}
                  >
                    <Lock />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        user={selectedUser}
        onSubmitSuccess={fetchUsers}
      />

      <ChangePasswordDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        userId={selectedUser?.id}
      />
    </Box>
  );
};

export default UserManagement;
