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

connectDB();

app.use(helmet()); // Security Headers
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(xss()); // Prevent XSS Attacks
app.use(mongoSanitize()); // Prevent NoSQL Injection

app.use(
    cors({
        origin: "https://multi-level-category.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const limiter = rateLimit({
    windowMs: 20 * 60 * 1000, // 15 minutes
    max: 500, // Limit to 100 requests per IP
    message: { error: "Too many requests, please try again later." },
    headers: true,
});

app.use("/api/", limiter);

app.use(express.json());
app.use(cookieParser());

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

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

app.use((req, res, next) => {
    res.handler = new ResponseHandler(req, res);
    next();
});

app.use("/api/", rootRouter);

app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message} | URL: ${req.originalUrl} | IP: ${req.ip}`);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`🚀 Server running securely on port ${PORT}`));
// module.exports = { app }


