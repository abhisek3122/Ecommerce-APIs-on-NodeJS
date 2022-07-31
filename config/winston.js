"use strict";
var appRoot = require('app-root-path');
var winston = require('winston');
var path = require('path');

var options = {
  file: {
    level: 'info',
    filename: path.join(appRoot.toString(), 'logs', 'app.log'),
    handleExceptions: true,
    json: true, 
    maxsize: 5242880, // 5MB
    colorize: false,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: true,
    colorize: false,
  }
};

var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
