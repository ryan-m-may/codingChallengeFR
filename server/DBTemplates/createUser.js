/* eslint-disable no-undef */
db.createUser(
  {
    user: 'guest',
    pwd: 'password',
    roles: [{ role: 'read', db: 'employeeDB' }],
  },
);
