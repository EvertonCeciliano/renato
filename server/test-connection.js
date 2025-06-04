const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    // First try to connect without database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'meu_banco',
      port: 3307
    });
    
    console.log('Successfully connected to MySQL');
    
    // Try to create database
    await connection.query('CREATE DATABASE IF NOT EXISTS restaurant_management');
    console.log('Database created or verified');
    
    // Connect to the database
    await connection.query('USE restaurant_management');
    console.log('Using database: restaurant_management');
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testConnection();
