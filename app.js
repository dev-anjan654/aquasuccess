const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./src/routes/adminRoutes');
const fieldTechnicianRoutes = require('./src/routes/FieldTechnicianRoutes');
const abmRoutes = require('./src/routes/AbmRoute');
const rbmRoutes = require('./src/routes/RbmRoute');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors())

app.get("/", (req, res) => {
    res.send("<h2>Aquasuccess server is running 😀</h2>");
})

// routes
app.use(adminRoutes);
app.use(fieldTechnicianRoutes);
app.use(abmRoutes);
app.use(rbmRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
