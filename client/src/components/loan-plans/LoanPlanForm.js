import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  months: Yup.number()
    .required('Months is required')
    .positive('Months must be positive')
    .integer('Months must be a whole number'),
  interest_percentage: Yup.number()
    .required('Interest rate is required')
    .positive('Interest rate must be positive'),
  penalty_rate: Yup.number()
    .required('Penalty rate is required')
    .positive('Penalty rate must be positive')
});

const LoanPlanForm = ({ open, onClose, loanPlan, onSubmitSuccess }) => {
  const formik = useFormik({
    initialValues: {
      months: loanPlan?.months || '',
      interest_percentage: loanPlan?.interest_percentage || '',
      penalty_rate: loanPlan?.penalty_rate || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (loanPlan) {
          await axios.put(`http://localhost:5000/api/loan-plans/${loanPlan.id}`, values);
        } else {
          await axios.post('http://localhost:5000/api/loan-plans', values);
        }
        onSubmitSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving loan plan:', error);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {loanPlan ? 'Edit Loan Plan' : 'New Loan Plan'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="months"
                label="Number of Months"
                type="number"
                value={formik.values.months}
                onChange={formik.handleChange}
                error={formik.touched.months && Boolean(formik.errors.months)}
                helperText={formik.touched.months && formik.errors.months}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="interest_percentage"
                label="Interest Rate (%)"
                type="number"
                value={formik.values.interest_percentage}
                onChange={formik.handleChange}
                error={formik.touched.interest_percentage && Boolean(formik.errors.interest_percentage)}
                helperText={formik.touched.interest_percentage && formik.errors.interest_percentage}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="penalty_rate"
                label="Penalty Rate (%)"
                type="number"
                value={formik.values.penalty_rate}
                onChange={formik.handleChange}
                error={formik.touched.penalty_rate && Boolean(formik.errors.penalty_rate)}
                helperText={formik.touched.penalty_rate && formik.errors.penalty_rate}
              />
            </Grid>
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

export default LoanPlanForm;
