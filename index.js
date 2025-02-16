const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/Database.config.js');
const rootRouter = require('./routes/index.js');

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/', rootRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
