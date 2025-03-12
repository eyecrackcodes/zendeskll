import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import axios from "axios";
import Layout from "../components/Layout";

function CustomerProfile({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const customerResponse = await axios.get(
        `http://localhost:3001/customers/${id}`
      );
      setCustomer(customerResponse.data);

      const ticketsResponse = await axios.get("http://localhost:3001/tickets");
      const customerTickets = ticketsResponse.data.filter(
        (ticket) => ticket.customerId === parseInt(id)
      );
      setTickets(customerTickets);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  if (!customer) {
    return (
      <Layout onLogout={onLogout}>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout onLogout={onLogout}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Customer Profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Name:</strong> {customer.name}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Policy Number:</strong> {customer.policyNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Coverage Amount:</strong> ${customer.coverage}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Beneficiary:</strong> {customer.beneficiary}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Associated Tickets</Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
              >
                Create New Ticket
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Latest Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      hover
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                      <TableCell>
                        {ticket.notes[ticket.notes.length - 1]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default CustomerProfile;
