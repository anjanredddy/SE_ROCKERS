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
  borrower_id: Yup.string().required('Borrower is required'),
  loan_type_id: Yup.string().required('Loan type is required'),
  plan_id: Yup.string().required('Loan plan is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  purpose: Yup.string().required('Purpose is required')
});

const LoanForm = ({ open, onClose, loan, onSubmitSuccess }) => {
  const [borrowers, setBorrowers] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [calculationDetails, setCalculationDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [borrowersRes, typesRes, plansRes] = await Promise.all([
          axios.get('http://localhost:5000/api/borrowers'),
          axios.get('http://localhost:5000/api/loan-types'),
          axios.get('http://localhost:5000/api/loan-plans')
        ]);
        setBorrowers(borrowersRes.data);
        setLoanTypes(typesRes.data);
        setLoanPlans(plansRes.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      borrower_id: loan?.borrower_id || '',
      loan_type_id: loan?.loan_type_id || '',
      plan_id: loan?.plan_id || '',
      amount: loan?.amount || '',
      purpose: loan?.purpose || '',
      status: loan?.status || '0'
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (loan) {
          await axios.put(`http://localhost:5000/api/loans/${loan.id}`, values);
        } else {
          await axios.post('http://localhost:5000/api/loans', values);
        }
        onSubmitSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving loan:', error);
      }
    }
  });

  const calculateLoan = async () => {
    if (formik.values.amount && formik.values.plan_id) {
      try {
        const response = await axios.post('http://localhost:5000/api/loans/calculate', {
          amount: formik.values.amount,
          plan_id: formik.values.plan_id
        });
        setCalculationDetails(response.data);
      } catch (error) {
        console.error('Error calculating loan:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {loan ? 'Edit Loan Application' : 'New Loan Application'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="borrower_id"
                label="Borrower"
                value={formik.values.borrower_id}
                onChange={formik.handleChange}
                error={formik.touched.borrower_id && Boolean(formik.errors.borrower_id)}
                helperText={formik.touched.borrower_id && formik.errors.borrower_id}
              >
                {borrowers.map((borrower) => (
                  <MenuItem key={borrower.id} value={borrower.id}>
                    {`${borrower.lastname}, ${borrower.firstname}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="loan_type_id"
                label="Loan Type"
                value={formik.values.loan_type_id}
                onChange={formik.handleChange}
                error={formik.touched.loan_type_id && Boolean(formik.errors.loan_type_id)}
                helperText={formik.touched.loan_type_id && formik.errors.loan_type_id}
              >
                {loanTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.type_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="plan_id"
                label="Loan Plan"
                value={formik.values.plan_id}
                onChange={formik.handleChange}
                error={formik.touched.plan_id && Boolean(formik.errors.plan_id)}
                helperText={formik.touched.plan_id && formik.errors.plan_id}
              >
                {loanPlans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {`${plan.months} months - ${plan.interest_percentage}% interest`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="amount"
                label="Loan Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="purpose"
                label="Purpose"
                multiline
                rows={3}
                value={formik.values.purpose}
                onChange={formik.handleChange}
                error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                helperText={formik.touched.purpose && formik.errors.purpose}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={calculateLoan}
                disabled={!formik.values.amount || !formik.values.plan_id}
              >
                Calculate Loan
              </Button>
            </Grid>

            {calculationDetails && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h6">Loan Calculation Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography>Total Payable:</Typography>
                      <Typography variant="h6">
                        ${calculationDetails.total_payable.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>Monthly Payment:</Typography>
                      <Typography variant="h6">
                        ${calculationDetails.monthly_payment.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>Penalty Rate:</Typography>
                      <Typography variant="h6">
                        {calculationDetails.penalty_rate}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoanForm;
