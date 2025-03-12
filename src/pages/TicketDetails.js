import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import axios from "axios";
import Layout from "../components/Layout";

function TicketDetails({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const ticketResponse = await axios.get(
        `http://localhost:3001/tickets/${id}`
      );
      setTicket(ticketResponse.data);

      const customerResponse = await axios.get(
        `http://localhost:3001/customers/${ticketResponse.data.customerId}`
      );
      setCustomer(customerResponse.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/tickets/${id}`, {
        status: newStatus,
      });
      setTicket({ ...ticket, status: newStatus });
      setSnackbar({
        open: true,
        message: `Status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const updatedNotes = [...ticket.notes, newNote];
      await axios.patch(`http://localhost:3001/tickets/${id}`, {
        notes: updatedNotes,
      });
      setTicket({ ...ticket, notes: updatedNotes });
      setNewNote("");
      setSnackbar({
        open: true,
        message: "Note added successfully",
      });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleSimulateCall = () => {
    setSnackbar({
      open: true,
      message: "Calling customer...",
    });
  };

  const handleSyncToSnowflake = () => {
    setSnackbar({
      open: true,
      message: "Data synced successfully to Snowflake",
    });
  };

  if (!ticket || !customer) {
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
              Ticket #{ticket.id}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Status: {ticket.status}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Created: {ticket.createdAt}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleStatusUpdate("open")}
                    color={ticket.status === "open" ? "primary" : "default"}
                  >
                    Open
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleStatusUpdate("in progress")}
                    color={
                      ticket.status === "in progress" ? "primary" : "default"
                    }
                  >
                    In Progress
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleStatusUpdate("closed")}
                    color={ticket.status === "closed" ? "primary" : "default"}
                  >
                    Closed
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Typography>Name: {customer.name}</Typography>
            <Typography>Policy Number: {customer.policyNumber}</Typography>
            <Typography>Coverage Amount: ${customer.coverage}</Typography>
            <Typography>Beneficiary: {customer.beneficiary}</Typography>
            <Button
              variant="text"
              onClick={() => navigate(`/customer/${customer.id}`)}
              sx={{ mt: 2 }}
            >
              View Full Profile
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={handleSimulateCall}
              >
                Simulate Phone Call
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={handleSyncToSnowflake}
              >
                Sync to Snowflake
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <List>
              {ticket.notes.map((note, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText primary={note} />
                  </ListItem>
                  {index < ticket.notes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Add Note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                multiline
                rows={2}
              />
              <Button
                variant="contained"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                Add Note
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default TicketDetails;
