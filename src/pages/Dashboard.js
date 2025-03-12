import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Phone as PhoneIcon } from "@mui/icons-material";
import axios from "axios";
import Layout from "../components/Layout";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerName: "",
    issueDescription: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tickets", {
        customerId: Math.floor(Math.random() * 2) + 1, // Simulate customer ID
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        notes: [newTicket.issueDescription],
      });
      setTickets([...tickets, response.data]);
      setOpenDialog(false);
      setNewTicket({ customerName: "", issueDescription: "" });
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleSimulateCall = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tickets", {
        customerId: Math.floor(Math.random() * 2) + 1,
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        notes: ["Incoming call from customer"],
      });
      setTickets([...tickets, response.data]);
    } catch (error) {
      console.error("Error simulating call:", error);
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create New Ticket
        </Button>
        <Button
          variant="outlined"
          startIcon={<PhoneIcon />}
          onClick={handleSimulateCall}
        >
          Simulate Incoming Call
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
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
                <TableCell>
                  {ticket.customerId === 1 ? "John Doe" : "Alice Smith"}
                </TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Customer Name"
            fullWidth
            value={newTicket.customerName}
            onChange={(e) =>
              setNewTicket({ ...newTicket, customerName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Issue Description"
            fullWidth
            multiline
            rows={4}
            value={newTicket.issueDescription}
            onChange={(e) =>
              setNewTicket({ ...newTicket, issueDescription: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTicket} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Dashboard;
