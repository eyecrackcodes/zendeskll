import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Layout from "../components/Layout";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reporting({ onLogout }) {
  // Sample data for the last 7 days
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Ticket Volume",
        data: [2, 3, 1, 4, 2, 5, 3],
        backgroundColor: "rgba(25, 118, 210, 0.5)",
        borderColor: "rgb(25, 118, 210)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ticket Volume Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Layout onLogout={onLogout}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Reporting Dashboard
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar options={options} data={data} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Reporting;
