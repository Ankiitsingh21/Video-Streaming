const express = require('express');
const http = require('http');
const cors = require('cors');
const {connect} = require('./config/database.js');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/index.js');
const { PORT } = require('./config/serverConfig.js');
const { initSocket } = require('./sockets');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// CORS for frontend
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

server.listen(PORT, async () => {
  console.log(`Server Started on PORT ${PORT}`);
  await connect();
  console.log('MongoDB is connected');
});