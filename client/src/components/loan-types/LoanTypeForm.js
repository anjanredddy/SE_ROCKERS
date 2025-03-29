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
  type_name: Yup.string().required('Type name is required'),
  description: Yup.string().required('Description is required')
});

const LoanTypeForm = ({ open, onClose, loanType, onSubmitSuccess }) => {
  const formik = useFormik({
    initialValues: {
      type_name: loanType?.type_name || '',
      description: loanType?.description || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (loanType) {
          await axios.put(`http://localhost:5000/api/loan-types/${loanType.id}`, values);
        } else {
          await axios.post('http://localhost:5000/api/loan-types', values);
        }
        onSubmitSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving loan type:', error);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {loanType ? 'Edit Loan Type' : 'New Loan Type'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="type_name"
                label="Type Name"
                value={formik.values.type_name}
                onChange={formik.handleChange}
                error={formik.touched.type_name && Boolean(formik.errors.type_name)}
                helperText={formik.touched.type_name && formik.errors.type_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
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

export default LoanTypeForm;
