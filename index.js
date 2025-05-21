const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const cellRoutes = require('./routes/cellRoutes');

const app = express();
const PORT = process.env.PORT || 3306;

function getPublicIP() {
  https.get('https://api.ipify.org?format=json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const ip = JSON.parse(data).ip;
        console.log("Render Public IP:", ip);
      } catch (err) {
        console.error("Failed to parse IP:", err.message);
      }
    });
  }).on('error', (err) => {
    console.error("Failed to get public IP:", err.message);
  });
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