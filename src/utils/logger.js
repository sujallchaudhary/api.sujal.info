const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'), 
    { flags: 'a' }
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
    path.join(logsDir, 'error.log'), 
    { flags: 'a' }
);

// Custom log format with timestamp
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Create different logging configurations
const morganMiddleware = {
    // Log all requests to console in development
    console: morgan('combined', {
        skip: (req, res) => process.env.NODE_ENV === 'production'
    }),

    // Log all requests to file
    file: morgan(logFormat, {
        stream: accessLogStream
    }),

    // Log only errors (4xx and 5xx) to error file
    errorFile: morgan(logFormat, {
        stream: errorLogStream,
        skip: (req, res) => res.statusCode < 400
    }),

    // Custom format for API endpoints
    api: morgan(':date[iso] :method :url :status :response-time ms - :res[content-length] bytes', {
        skip: (req, res) => !req.url.startsWith('/api/')
    })
};

// Custom logging function for application logs
const logger = {
    info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] INFO: ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}\n`;
        
        console.log(logMessage.trim());
        fs.appendFileSync(path.join(logsDir, 'app.log'), logMessage);
    },

    error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        const errorMessage = error ? (error.stack || error.message || error) : '';
        const logMessage = `[${timestamp}] ERROR: ${message}${errorMessage ? ' | Error: ' + errorMessage : ''}\n`;
        
        console.error(logMessage.trim());
        fs.appendFileSync(path.join(logsDir, 'error.log'), logMessage);
    },

    warn: (message, data = null) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] WARN: ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}\n`;
        
        console.warn(logMessage.trim());
        fs.appendFileSync(path.join(logsDir, 'app.log'), logMessage);
    },

    debug: (message, data = null) => {
        if (process.env.NODE_ENV === 'development') {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] DEBUG: ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}\n`;
            
            console.log(logMessage.trim());
            fs.appendFileSync(path.join(logsDir, 'debug.log'), logMessage);
        }
    }
};

module.exports = {
    morganMiddleware,
    logger
};
