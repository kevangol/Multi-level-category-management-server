const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/Database.config.js");
const rootRouter = require("./routes/index.js");
const ResponseHandler = require("./config/ResponseHandler.config.js");

dotenv.config();
const app = express();

// ✅ **Connect to MongoDB**
connectDB();

// ✅ **Security Middleware**
app.use(helmet()); // Security Headers
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(xss()); // Prevent XSS Attacks
app.use(mongoSanitize()); // Prevent NoSQL Injection

// ✅ **CORS Policy**
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ **Rate Limiting**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit to 100 requests per IP
    message: { error: "Too many requests, please try again later." },
    headers: true,
});

app.use("/api/", limiter);

// ✅ **JSON & Cookie Middleware**
app.use(express.json());
app.use(cookieParser());

// ✅ **Logging Setup (Winston + Morgan)**
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create Winston Logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "logs/errors.log", level: "error" }),
        new winston.transports.File({ filename: "logs/requests.log" }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

// Morgan request logging to Winston
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :remote-addr :user-agent",
        {
            stream: {
                write: (message) => logger.info(message.trim()),
            },
        }
    )
);

// ✅ **Response Handler Middleware**
app.use((req, res, next) => {
    res.handler = new ResponseHandler(req, res);
    next();
});

// ✅ **API Routes**
app.use("/api/", rootRouter);

// ✅ **Error Handling Middleware**
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message} | URL: ${req.originalUrl} | IP: ${req.ip}`);
    res.status(500).json({ error: "Internal Server Error" });
});

// ✅ **Start Server**
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`🚀 Server running securely on port ${PORT}`));
// module.exports = { app }


