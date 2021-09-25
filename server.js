const express = require('express');
const testConnection = require('./db');

const app = express();

// Allow host to configure the port
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
  testConnection();
});

// endpoint to authenticate the user
app.post('/login', (req, res) => {
  // return http code "401" if endpoints are invoked without proper authentication

  // return http code "200" with the results if endpoints are invoked with correct
  // authentication information
});

// accepts a csv file and incrementally updates MongoDB
// or CassandraDB with the data from CSV file
app.post('/upload', (req, res) => {

});

// returns data that is saved in MongoDB from previous CSV file uploads
app.get('/identites', (req, res) => {

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
