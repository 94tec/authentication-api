// index.js
const express = require('express');
const authRoutes = require('./src/routes/auth.js');

const app = express();

app.use(express.json());

// Use the imported routes
app.use('/auth', authRoutes);

// Other routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
