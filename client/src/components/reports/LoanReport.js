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
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const LoanReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);

  const generateReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/loans', {
        params: {
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString()
        }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/loans/export', {
        params: {
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString()
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'loan_report.xlsx');
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference No</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Loan Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Total Payable</TableCell>
              <TableCell>Total Paid</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Released</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.ref_no}</TableCell>
                <TableCell>{loan.borrower_name}</TableCell>
                <TableCell>{loan.loan_type}</TableCell>
                <TableCell>${loan.amount.toLocaleString()}</TableCell>
                <TableCell>${loan.total_payable.toLocaleString()}</TableCell>
                <TableCell>${loan.total_paid.toLocaleString()}</TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>
                  {new Date(loan.date_released).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoanReport;
