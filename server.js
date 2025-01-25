// Import Fastify, MySQL, and CORS
const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const cors = require('@fastify/cors'); // Use the updated CORS package
require('dotenv').config(); // Load environment variables

// Database connection pool setup
const db = mysql.createPool({
  host: process.env.DB_HOST,         // Database host
  user: process.env.DB_USER,         // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,     // Database name
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : null, // Optional SSL support
});

fastify.register(cors, { origin: '*' }); // Register CORS
fastify.decorate('db', db);   

// Default route
fastify.get("/", () => "Report API is running");

// API Route to generate a report of users
fastify.get('/report/users', async (request, reply) => {
  try {
    // Query to select all users
    const [rows] = await fastify.db.query('SELECT * FROM users');
    
    // Return the data in the response
    reply.send({
      success: true,
      data: rows,
    });
  } catch (error) {
    // Handle errors and respond
    fastify.log.error(`Database error: ${error.message}`);
    reply.status(500).send({
      success: false,
      message: 'Failed to fetch user data',
      error: error.message,
    });
  }
});

// Debug route to test database connection
fastify.get('/test-db', async (request, reply) => {
  try {
    await fastify.db.query('SELECT 1'); // Simple query to test connection
    reply.send({ success: true, message: 'Database connection successful' });
  } catch (error) {
    fastify.log.error(`Database connection failed: ${error.message}`);
    reply.status(500).send({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Start the Fastify server
const start = async () => {
  try {
    await fastify.listen({
      port: 4000, 
      host: '0.0.0.0'  // Or 'localhost' for local access
    });
    fastify.log.info(`Server running at http://localhost:4000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();



// // Import Fastify, MySQL, and CORS
// const fastify = require('fastify')({ logger: true });
// const mysql = require('mysql2/promise');
// const cors = require('@fastify/cors'); // Use the updated CORS package

// // Database connection pool setup
// const db = mysql.createPool({
//   host: 'localhost',        // Replace with your database host
//   user: 'root',             // Replace with your database user
//   password: 'root',         // Replace with your database password
//   database: 'testDB',       // Replace with your database name
// });

// // Decorate Fastify with the database connection
// fastify.decorate('db', db);

// // Register CORS plugin
// fastify.register(cors, {
//   origin: '*',  // Allow all origins (you can restrict it to specific origins)
// });

// // Default route
// fastify.get("/", () => "report API is running");

// // API Route to generate a report of users
// fastify.get('/report/users', async (request, reply) => {
//   try {
//     // Query to select all users
//     const [rows] = await fastify.db.query('SELECT * FROM users');
    
//     // Return the data in the response
//     reply.send({
//       success: true,
//       data: rows,
//     });
//   } catch (error) {
//     // Handle errors and respond
//     fastify.log.error(error);
//     reply.status(500).send({
//       success: false,
//       message: 'Failed to fetch user data',
//       error: error.message,
//     });
//   }
// });

// // Start the Fastify server
// const start = async () => {
//   try {
//     await fastify.listen({
//       port: 4000, 
//       host: '0.0.0.0'  // Or 'localhost' for local access
//     });
//     fastify.log.info(`Server running at http://localhost:4000`);
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();
