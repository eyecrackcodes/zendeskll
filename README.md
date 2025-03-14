# Final Expense Insurance Ticketing System

A full-stack web application mockup for a ticketing system tailored for final expense life insurance customer service. Built with React, Material-UI, and json-server.

## Features

- User authentication
- Ticket management (create, view, update status)
- Customer profiles
- Reporting dashboard with charts
- Simulated integrations (Dialpad, Snowflake)
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd final-expense-ticketing-system
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the mock backend server (in one terminal):

```bash
npm run server
```

2. Start the React development server (in another terminal):

```bash
npm start
```

The application will be available at http://localhost:3000

## Login Credentials

- Username: agent
- Password: password

## Project Structure

```
src/
  ├── components/
  │   └── Layout.js
  ├── pages/
  │   ├── Login.js
  │   ├── Dashboard.js
  │   ├── TicketDetails.js
  │   ├── CustomerProfile.js
  │   └── Reporting.js
  ├── App.js
  └── index.js
```

## Technologies Used

- React
- Material-UI
- Chart.js
- json-server
- React Router
- Axios

## Mock Data

The application uses json-server to simulate a backend API with the following endpoints:

- GET /users - Get user data
- GET /tickets - Get all tickets
- GET /tickets/:id - Get ticket details
- POST /tickets - Create new ticket
- PATCH /tickets/:id - Update ticket
- GET /customers - Get all customers
- GET /customers/:id - Get customer details
#   z e n d e s k l l  
 