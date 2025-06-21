const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { morganMiddleware, logger } = require('./src/utils/logger');
const dbConnection = require('./src/database/connection');

dotenv.config();
const app = express();

app.use(morganMiddleware.console);
app.use(morganMiddleware.file);
app.use(morganMiddleware.errorFile);
app.use(morganMiddleware.api);

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: true,
        credentials: true
    }));
} else {
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const allowedPattern = /^https?:\/\/([a-zA-Z0-9-]+\.)*sujal\.info(:\d+)?$/;
            if (allowedPattern.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

dbConnection();

// Log application startup
logger.info('Application starting...', {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString()
});

const portfolioRoutes = require('./src/routes/portfolio.route');
const nsutRoutes = require('./src/routes/nsut.route');
const authRoutes = require('./src/routes/auth.route');
const urlRoutes = require('./src/routes/url.route');


app.use('/api/portfolio', portfolioRoutes);
app.use('/api/nsut', nsutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'api is working fine.',
    });
});

app.listen(process.env.PORT || 5000, () => {
    const port = process.env.PORT || 5000;
    console.log(`Server is running on port ${port}`);
    logger.info(`Server started successfully on port ${port}`, {
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at Promise', { reason, promise });
    process.exit(1);
});


