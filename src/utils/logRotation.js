const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Function to rotate logs when they get too large
const rotateLogs = () => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const logFiles = ['access.log', 'error.log', 'app.log', 'debug.log'];

    logFiles.forEach(file => {
        const filePath = path.join(logsDir, file);
        
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            
            if (stats.size > maxSize) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupPath = path.join(logsDir, `${file}.${timestamp}`);
                
                // Move current log to backup
                fs.renameSync(filePath, backupPath);
                
                // Create new empty log file
                fs.writeFileSync(filePath, '');
                
                console.log(`Log rotated: ${file} -> ${path.basename(backupPath)}`);
            }
        }
    });
};

// Function to clean old log files (keep only last 10 rotated files)
const cleanOldLogs = () => {
    if (!fs.existsSync(logsDir)) return;
    
    const files = fs.readdirSync(logsDir);
    const logGroups = {};
    
    // Group files by base name
    files.forEach(file => {
        const match = file.match(/^(.+?)\.log(\..+)?$/);
        if (match) {
            const baseName = match[1];
            if (!logGroups[baseName]) {
                logGroups[baseName] = [];
            }
            logGroups[baseName].push(file);
        }
    });
    
    // Keep only the 10 most recent files for each log type
    Object.keys(logGroups).forEach(baseName => {
        const files = logGroups[baseName]
            .filter(file => file !== `${baseName}.log`) // Don't include current log
            .sort((a, b) => {
                const aStats = fs.statSync(path.join(logsDir, a));
                const bStats = fs.statSync(path.join(logsDir, b));
                return bStats.mtime - aStats.mtime; // Sort by modification time, newest first
            });
        
        // Delete files beyond the 10 most recent
        if (files.length > 10) {
            files.slice(10).forEach(file => {
                fs.unlinkSync(path.join(logsDir, file));
                console.log(`Deleted old log file: ${file}`);
            });
        }
    });
};

// Export functions
module.exports = {
    rotateLogs,
    cleanOldLogs
};

// If run directly, perform log maintenance
if (require.main === module) {
    console.log('Starting log maintenance...');
    rotateLogs();
    cleanOldLogs();
    console.log('Log maintenance completed.');
}
