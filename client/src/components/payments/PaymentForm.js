import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  loan_id: Yup.string().required('Loan reference is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  payee: Yup.string().required('Payee name is required')
});

const PaymentForm = ({ open, onClose, payment, onSubmitSuccess }) => {
  const [loans, setLoans] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/loans/active');
        setLoans(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    fetchLoans();
  }, []);

  const fetchPaymentDetails = async (loanId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/loans/${loanId}/payment-details`);
      setPaymentDetails(response.data);
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      loan_id: payment?.loan_id || '',
      amount: payment?.amount || '',
      payee: payment?.payee || '',
      penalty_amount: payment?.penalty_amount || 0
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (payment) {
          await axios.put(`http://localhost:5000/api/payments/${payment.id}`, values);
        } else {
          await axios.post('http://localhost:5000/api/payments', values);
        }
        onSubmitSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving payment:', error);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {payment ? 'Edit Payment' : 'New Payment'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="loan_id"
                label="Loan Reference"
                value={formik.values.loan_id}
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchPaymentDetails(e.target.value);
                }}
                error={formik.touched.loan_id && Boolean(formik.errors.loan_id)}
                helperText={formik.touched.loan_id && formik.errors.loan_id}
              >
                {loans.map((loan) => (
                  <MenuItem key={loan.id} value={loan.id}>
                    {`${loan.ref_no} - ${loan.borrower_name}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {paymentDetails && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1">Payment Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography>Monthly Amount:</Typography>
                      <Typography variant="h6">
                        ${paymentDetails.monthly_amount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>Penalty (if late):</Typography>
                      <Typography variant="h6">
                        ${paymentDetails.penalty_amount.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="payee"
                label="Payee Name"
                value={formik.values.payee}
                onChange={formik.handleChange}
                error={formik.touched.payee && Boolean(formik.errors.payee)}
                helperText={formik.touched.payee && formik.errors.payee}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="amount"
                label="Payment Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Payment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm;
