import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Grid,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const PaymentReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalPenalties: 0
  });

  const generateReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/payments', {
        params: {
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString()
        }
      });
      setReportData(response.data.payments);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/payments/export', {
        params: {
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString()
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payment_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={generateReport}
                disabled={!startDate || !endDate}
              >
                Generate Report
              </Button>
              <Button
                variant="outlined"
                onClick={exportToExcel}
                disabled={reportData.length === 0}
              >
                Export to Excel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {reportData.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Total Payments</Typography>
              <Typography variant="h4">${summary.totalPayments.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Total Penalties</Typography>
              <Typography variant="h4">${summary.totalPenalties.toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Date</TableCell>
              <TableCell>Loan Reference</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Payment Amount</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.payment_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{payment.loan_ref_no}</TableCell>
                <TableCell>{payment.borrower_name}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>${payment.penalty_amount.toLocaleString()}</TableCell>
                <TableCell>
                  ${(payment.amount + payment.penalty_amount).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentReport;
