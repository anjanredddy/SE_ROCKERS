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
  Box,
  Chip
} from '@mui/material';
import { Edit, Add, Visibility } from '@mui/icons-material';
import axios from 'axios';
import LoanForm from './LoanForm';

// Rest of your code remains exactly the same...

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const getLoanStatusChip = (status) => {
    const statusMap = {
      0: { label: 'Pending', color: 'warning' },
      1: { label: 'Approved', color: 'info' },
      2: { label: 'Released', color: 'success' },
      3: { label: 'Completed', color: 'success' },
      4: { label: 'Denied', color: 'error' }
    };
    const statusInfo = statusMap[status] || { label: 'Unknown', color: 'default' };
    return <Chip label={statusInfo.label} color={statusInfo.color} size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Loan List</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedLoan(null);
            setOpenForm(true);
          }}
        >
          New Loan Application
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Loan Details</TableCell>
              <TableCell>Next Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan, index) => (
              <TableRow key={loan.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{loan.borrower_name}</TableCell>
                <TableCell>
                  <div>Type: {loan.loan_type}</div>
                  <div>Amount: ${loan.amount}</div>
                  <div>Plan: {loan.plan}</div>
                </TableCell>
                <TableCell>
                  {loan.next_payment_date ? new Date(loan.next_payment_date).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>{getLoanStatusChip(loan.status)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setSelectedLoan(loan)}>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoanForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        loan={selectedLoan}
        onSubmitSuccess={fetchLoans}
      />
    </Box>
  );
};

export default LoansList;
