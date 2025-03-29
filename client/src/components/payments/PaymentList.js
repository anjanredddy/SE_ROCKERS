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
  Typography,
  Box
} from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from 'axios';
import PaymentForm from './PaymentForm';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Payment List</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedPayment(null);
            setOpenForm(true);
          }}
        >
          New Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Loan Reference</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payment.loan_ref_no}</TableCell>
                <TableCell>{payment.borrower_name}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>${payment.penalty_amount.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(payment.date_created).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaymentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        payment={selectedPayment}
        onSubmitSuccess={fetchPayments}
      />
    </Box>
  );
};

export default PaymentsList;
