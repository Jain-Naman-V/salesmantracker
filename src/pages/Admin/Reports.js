import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');

  const summaryData = [
    {
      title: 'Total Trips',
      value: '156',
      change: '+12%',
      trend: 'up',
      color: '#4caf50'
    },
    {
      title: 'Total Distance',
      value: '2,450 km',
      change: '+8%',
      trend: 'up',
      color: '#2196f3'
    },
    {
      title: 'Total Cost',
      value: '₹19,600',
      change: '+5%',
      trend: 'up',
      color: '#ff9800'
    },
    {
      title: 'Active Sales People',
      value: '8',
      change: '-2%',
      trend: 'down',
      color: '#f44336'
    }
  ];

  const topPerformers = [
    { name: 'John Doe', trips: 45, distance: 1250, cost: 10000 },
    { name: 'Jane Smith', trips: 38, distance: 980, cost: 7840 },
    { name: 'Mike Johnson', trips: 22, distance: 650, cost: 5200 },
    { name: 'Sarah Wilson', trips: 18, distance: 520, cost: 4160 },
    { name: 'David Brown', trips: 15, distance: 450, cost: 3600 }
  ];

  const monthlyData = [
    { month: 'Jan', trips: 45, distance: 1250, cost: 10000 },
    { month: 'Feb', trips: 52, distance: 1400, cost: 11200 },
    { month: 'Mar', trips: 38, distance: 980, cost: 7840 },
    { month: 'Apr', trips: 61, distance: 1650, cost: 13200 },
    { month: 'May', trips: 48, distance: 1300, cost: 10400 },
    { month: 'Jun', trips: 55, distance: 1500, cost: 12000 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => console.log('Export report')}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: item.color }}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {item.trend === 'up' ? (
                      <TrendingUpIcon sx={{ color: '#4caf50', mr: 1 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: '#f44336', mr: 1 }} />
                    )}
                    <Chip
                      label={item.change}
                      size="small"
                      color={item.trend === 'up' ? 'success' : 'error'}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Top Performers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sales Person</TableCell>
                    <TableCell align="right">Trips</TableCell>
                    <TableCell align="right">Distance (km)</TableCell>
                    <TableCell align="right">Cost (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPerformers.map((performer, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Chip
                            label={index + 1}
                            size="small"
                            color={index < 3 ? 'primary' : 'default'}
                            sx={{ mr: 1 }}
                          />
                          {performer.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{performer.trips}</TableCell>
                      <TableCell align="right">{performer.distance}</TableCell>
                      <TableCell align="right">{performer.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Trends
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Trips</TableCell>
                    <TableCell align="right">Distance (km)</TableCell>
                    <TableCell align="right">Cost (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.month}</TableCell>
                      <TableCell align="right">{data.trips}</TableCell>
                      <TableCell align="right">{data.distance}</TableCell>
                      <TableCell align="right">{data.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 