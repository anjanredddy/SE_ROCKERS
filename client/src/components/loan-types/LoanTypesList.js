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
import LoanTypeForm from './LoanTypeForm';

const LoanTypesList = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const fetchLoanTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loan-types');
      setLoanTypes(response.data);
    } catch (error) {
      console.error('Error fetching loan types:', error);
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan type?')) {
      try {
        await axios.delete(`http://localhost:5000/api/loan-types/${id}`);
        fetchLoanTypes();
      } catch (error) {
        console.error('Error deleting loan type:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Loan Types</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedType(null);
            setOpenForm(true);
          }}
        >
          New Loan Type
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Type Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanTypes.map((type, index) => (
              <TableRow key={type.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{type.type_name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setSelectedType(type);
                    setOpenForm(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(type.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoanTypeForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        loanType={selectedType}
        onSubmitSuccess={fetchLoanTypes}
      />
    </Box>
  );
};

export default LoanTypesList;
