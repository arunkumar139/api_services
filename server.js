// Import Fastify, MySQL, and CORS
const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const cors = require('@fastify/cors'); // Use the updated CORS package

// Database connection pool setup
const db = mysql.createPool({
  host: 'localhost',        // Replace with your database host
  user: 'root',             // Replace with your database user
  password: 'root',         // Replace with your database password
  database: 'testDB',       // Replace with your database name
});

// Decorate Fastify with the database connection
fastify.decorate('db', db);

// Register CORS plugin
fastify.register(cors, {
  origin: '*',  // Allow all origins (you can restrict it to specific origins)
});

// Default route
fastify.get("/", () => "report API is running");

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
    fastify.log.error(error);
    reply.status(500).send({
      success: false,
      message: 'Failed to fetch user data',
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
