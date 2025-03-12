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
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Add as AddIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import axios from "axios";
import Layout from "../components/Layout";

function CustomerProfile({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    issueDescription: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const customerResponse = await axios.get(
        `http://localhost:3001/customers/${id}`
      );
      setCustomer(customerResponse.data);
      setEditedCustomer(customerResponse.data);

      const ticketsResponse = await axios.get("http://localhost:3001/tickets");
      const customerTickets = ticketsResponse.data.filter(
        (ticket) => ticket.customerId === parseInt(id)
      );
      setTickets(customerTickets);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleEditCustomer = async () => {
    try {
      await axios.patch(
        `http://localhost:3001/customers/${id}`,
        editedCustomer
      );
      setCustomer(editedCustomer);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tickets", {
        customerId: parseInt(id),
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        notes: [newTicket.issueDescription],
      });
      setTickets([...tickets, response.data]);
      setOpenDialog(false);
      setNewTicket({ issueDescription: "" });
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "error";
      case "in progress":
        return "warning";
      case "closed":
        return "success";
      default:
        return "default";
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
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h5">Customer Profile</Typography>
              <Box>
                <Tooltip title="Edit Profile">
                  <IconButton onClick={() => setEditMode(!editMode)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Call Customer">
                  <IconButton>
                    <PhoneIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Email Customer">
                  <IconButton>
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {editMode ? (
                  <>
                    <TextField
                      fullWidth
                      label="Name"
                      value={editedCustomer.name}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          name: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Policy Number"
                      value={editedCustomer.policyNumber}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          policyNumber: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleEditCustomer}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditMode(false);
                        setEditedCustomer(customer);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1">
                      <strong>Name:</strong> {customer.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Policy Number:</strong> {customer.policyNumber}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Coverage Amount:</strong> $
                  {customer.coverage.toLocaleString()}
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
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HistoryIcon />
                <Typography variant="h6">Ticket History</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
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
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          color={getStatusColor(ticket.status)}
                          size="small"
                        />
                      </TableCell>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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

export default CustomerProfile;
