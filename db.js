const { Client } = require('pg');

const client = new Client({
  user: 'postgres',  // Change to your PostgreSQL username
  host: 'localhost',
  database: 'biger',
  password: '5566',  // Change to your PostgreSQL password
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err));

module.exports = client;
