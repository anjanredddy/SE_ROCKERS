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
import LoanPlanForm from './LoanPlanForm';

const LoanPlansList = () => {
  const [loanPlans, setLoanPlans] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchLoanPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loan-plans');
      setLoanPlans(response.data);
    } catch (error) {
      console.error('Error fetching loan plans:', error);
    }
  };

  useEffect(() => {
    fetchLoanPlans();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan plan?')) {
      try {
        await axios.delete(`http://localhost:5000/api/loan-plans/${id}`);
        fetchLoanPlans();
      } catch (error) {
        console.error('Error deleting loan plan:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Loan Plans</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedPlan(null);
            setOpenForm(true);
          }}
        >
          New Loan Plan
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Months</TableCell>
              <TableCell>Interest Rate (%)</TableCell>
              <TableCell>Penalty Rate (%)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanPlans.map((plan, index) => (
              <TableRow key={plan.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{plan.months} months</TableCell>
                <TableCell>{plan.interest_percentage}%</TableCell>
                <TableCell>{plan.penalty_rate}%</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setSelectedPlan(plan);
                    setOpenForm(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plan.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoanPlanForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        loanPlan={selectedPlan}
        onSubmitSuccess={fetchLoanPlans}
      />
    </Box>
  );
};

export default LoanPlansList;
