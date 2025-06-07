const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const app = require('./app.js'); // Import the Express app
const port = process.env.PORT || 3000;

// Create the HTTP server
const server = http.createServer(app);

// Attach Socket.IO logic
require('./socket.js')(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});