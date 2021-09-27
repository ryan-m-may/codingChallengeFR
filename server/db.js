const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Connection URL
const url = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(url);

// Insert a list of employees into the 'employees' collection
const insertManyEmployees = (employeeList) => (
  client.connect()
    .then(() => {
      const database = client.db('employeeDB');
      const collection = database.collection('employees');
      return collection.insertMany(employeeList, { ordered: false });
    })
    // If successful, send 200 status code and the number of rows inserted
    .then((result) => {
      client.close();
      return { status: 200, rowsUpdated: result.insertedCount };
    })
    .catch((error) => {
      client.close();
      // If duplicates exist in database (error 11000) update with the number of rows
      // that were successfully inserted
      if (error.code === 11000) {
        return { status: 409, rowsUpdated: error.result.nInserted };
      }
      // For any other error, send a 500 status code
      return { status: 500, rowsUpdated: 0 };
    })
);

// Get a list of all records in 'employees' collection
const getIdentites = () => (
  client.connect()
    .then(() => {
      const database = client.db('employeeDB');
      const collection = database.collection('employees');
      // Request every entry from 'employees' collection, as an array of objects
      return collection.find({}).toArray();
    })
    // If query is successful, send array of employees to server
    .then((result) => {
      client.close();
      return { status: 200, employees: result };
    })
    // If query is unsuccessful, send error code 500
    .catch((error) => {
      client.close();
      console.log(error);
      return { status: 500, employees: [] };
    })
);

const findUser = ({ email }) => (
  client.connect()
    .then(() => {
      const database = client.db('employeeDB');
      const collection = database.collection('users');

      return collection.findOne({ email });
    })
    .then((user) => {
      client.close();
      return user;
    })
    .catch((error) => {
      client.close();
      console.error(error);
    })
);

const createUser = ({ email, password }) => {
  const saltRounds = 10;

  client.connect()
    .then(() => {
      const database = client.db('employeeDB');
      const collection = database.collection('users');

      return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => hash)
        .then((hashedPass) => collection.insertOne({ email, password: hashedPass }));
    })
    .then((result) => {
      client.close();
      console.log(result);
    })
    .catch((error) => {
      client.close();
      console.error(error);
    });
};

module.exports = {
  insertManyEmployees,
  getIdentites,
  findUser,
  createUser,
};
