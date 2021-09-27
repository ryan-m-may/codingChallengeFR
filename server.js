require('dotenv').config({ path: './server/config/config.env' });
const passport = require('passport');
require('./server/config/passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const { insertManyEmployees, getIdentites, createUser } = require('./server/db');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Passport Middleware
app.use(passport.initialize());

app.use(express.json());

// Authenticate the user
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign(
    { user_id: req.body.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' },
  );
  res.status(200).send(token);
});

// THIS ROUTE IS FOR TESTING ONLY
// ONLY IMPLEMENTED FOR THE SAKE OF THIS CODING CHALLENGE
app.get('/success', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).send('happy day');
});

// ROUTE IS FOR TESTING AND CREATING A DB USER
// ONLY IMPLEMENTED FOR THE SAKE OF THIS CODING CHALLENGE
app.post('/register', (req, res) => {
  createUser({
    email: 'test@example.com',
    password: 'password',
  });
  res.status(200).send('ok');
});

// Accept a CSV file of employees and upload to MongoDB
app.post('/upload', passport.authenticate('jwt', { session: false }), upload.single('csv'), (req, res) => {
  const employeeData = [];
  // Parse the CSV file temporarily stored in /uploads
  csv.parseFile(req.file.path, { headers: true })
    .on('error', () => res.status(500).send('Error parsing file.'))
    .on('data', (data) => employeeData.push(data))
    .on('end', () => {
      insertManyEmployees(employeeData)
        .then(({ status, rowsUpdated }) => {
          // Delete temporarily stored CSV file from /uploads after insert is done
          fs.unlinkSync(req.file.path);
          res.status(status).send(`Rows updated: ${rowsUpdated}`);
        });
    });
});

// Return data that is saved in MongoDB from previous CSV file uploads
app.get('/identites', passport.authenticate('jwt', { session: false }), (req, res) => {
  getIdentites()
    .then(({ status, employees }) => {
      res.status(status).send(employees);
    });
});

// For testing purposes, server will be exported and started
// in startServer.js.
module.exports = app;
