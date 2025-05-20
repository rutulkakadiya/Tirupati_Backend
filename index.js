const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const cellRoutes = require('./routes/cellRoutes');

const app = express();
const PORT = process.env.PORT || 1008;

import fetch from 'node-fetch';

async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    console.log("Render Public IP:", data.ip);
  } catch (err) {
    console.error("Failed to get public IP:", err.message);
  }
}

getPublicIP();


app.use(cors("https://tirupatipipes.easywayitsolutions.com"));
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.json()); // ✅ Needed to parse JSON bodies

app.use('/api', authRoutes);
app.use('/api/cells', cellRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});