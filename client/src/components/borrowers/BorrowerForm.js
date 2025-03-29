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
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  contact_no: Yup.string().required('Contact number is required'),
  address: Yup.string().required('Address is required'),
  tax_id: Yup.string().required('Tax ID is required')
});

const BorrowerForm = ({ open, onClose, borrower, onSubmitSuccess }) => {
  const formik = useFormik({
    initialValues: {
      firstname: borrower?.firstname || '',
      lastname: borrower?.lastname || '',
      middlename: borrower?.middlename || '',
      email: borrower?.email || '',
      contact_no: borrower?.contact_no || '',
      address: borrower?.address || '',
      tax_id: borrower?.tax_id || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (borrower) {
          await axios.put(`http://localhost:5000/api/borrowers/${borrower.id}`, values);
        } else {
          await axios.post('http://localhost:5000/api/borrowers', values);
        }
        onSubmitSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving borrower:', error);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {borrower ? 'Edit Borrower' : 'New Borrower'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="lastname"
                label="Last Name"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                helperText={formik.touched.lastname && formik.errors.lastname}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="firstname"
                label="First Name"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                helperText={formik.touched.firstname && formik.errors.firstname}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="middlename"
                label="Middle Name"
                value={formik.values.middlename}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={2}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="contact_no"
                label="Contact Number"
                value={formik.values.contact_no}
                onChange={formik.handleChange}
                error={formik.touched.contact_no && Boolean(formik.errors.contact_no)}
                helperText={formik.touched.contact_no && formik.errors.contact_no}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="tax_id"
                label="Tax ID"
                value={formik.values.tax_id}
                onChange={formik.handleChange}
                error={formik.touched.tax_id && Boolean(formik.errors.tax_id)}
                helperText={formik.touched.tax_id && formik.errors.tax_id}
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

export default BorrowerForm;
