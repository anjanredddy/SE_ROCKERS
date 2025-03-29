import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import BorrowerForm from './BorrowerForm';

const BorrowersList = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  const fetchBorrowers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/borrowers');
      setBorrowers(response.data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const handleEdit = (borrower) => {
    setSelectedBorrower(borrower);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this borrower?')) {
      try {
        await axios.delete(`http://localhost:5000/api/borrowers/${id}`);
        fetchBorrowers();
      } catch (error) {
        console.error('Error deleting borrower:', error);
      }
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Borrowers List</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedBorrower(null);
              setOpenForm(true);
            }}
          >
            New Borrower
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Tax ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowers.map((borrower, index) => (
                <TableRow key={borrower.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {`${borrower.lastname}, ${borrower.firstname} ${borrower.middlename}`}
                  </TableCell>
                  <TableCell>
                    <div>Email: {borrower.email}</div>
                    <div>Contact: {borrower.contact_no}</div>
                    <div>Address: {borrower.address}</div>
                  </TableCell>
                  <TableCell>{borrower.tax_id}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(borrower)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(borrower.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <BorrowerForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        borrower={selectedBorrower}
        onSubmitSuccess={fetchBorrowers}
      />
    </>
  );
};

export default BorrowersList;
