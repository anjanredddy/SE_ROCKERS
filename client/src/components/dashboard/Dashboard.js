import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper
} from '@mui/material';
import {
  AccountBalance,
  People,
  Payment,
  Assessment
} from '@mui/icons-material';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeBorrowers: 0,
    totalPayments: 0,
    pendingPayments: 0
  });

  const [chartData, setChartData] = useState({
    payments: [],
    loanTypes: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, paymentsRes, typesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats'),
          axios.get('http://localhost:5000/api/dashboard/payments-chart'),
          axios.get('http://localhost:5000/api/dashboard/loan-types-chart')
        ]);

        setStats(statsRes.data);
        setChartData({
          payments: paymentsRes.data,
          loanTypes: typesRes.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Loans"
            value={stats.totalLoans}
            icon={<AccountBalance sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Borrowers"
            value={stats.activeBorrowers}
            icon={<People sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payments"
            value={`$${stats.totalPayments.toLocaleString()}`}
            icon={<Payment sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Payments"
            value={`$${stats.pendingPayments.toLocaleString()}`}
            icon={<Assessment sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Trends
            </Typography>
            <Line
              data={{
                labels: chartData.payments.map(p => p.month),
                datasets: [{
                  label: 'Monthly Payments',
                  data: chartData.payments.map(p => p.amount),
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Loan Types Distribution
            </Typography>
            <Pie
              data={{
                labels: chartData.loanTypes.map(lt => lt.type_name),
                datasets: [{
                  data: chartData.loanTypes.map(lt => lt.count),
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                  ]
                }]
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
