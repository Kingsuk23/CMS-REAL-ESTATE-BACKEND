import winston from 'winston';
import { customLevel } from '../utils/ErrorLevel';
import { isDevEnvironment } from '../utils/isDevEnvironment';

// Define log output format
const formatter = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...mate } = info;

    return `${timestamp} $[${level}]: ${message} ${Object.keys(mate).length ? JSON.stringify(mate, null, 2) : ''}`;
  }),
);

class Logger {
  private logger: winston.Logger;

  constructor() {
    const prodTransport = new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    });
    const transport = new winston.transports.Console({
      format: formatter,
    });

    this.logger = winston.createLogger({
      level: isDevEnvironment() ? 'trace' : 'error', // Verbose in dev, minimal in prod
      levels: customLevel.levels,
      transports: [isDevEnvironment() ? transport : prodTransport],
    });

    winston.addColors(customLevel.colors); // Apply custom colors
  }

  // Logging methods for different levels
  trace(msg: any, meta?: any) {
    this.logger.log('trace', msg, meta);
  }
  debug(msg: any, meta?: any) {
    this.logger.debug(msg, meta);
  }
  info(msg: any, meta?: any) {
    this.logger.info(msg, meta);
  }
  warn(msg: any, meta?: any) {
    this.logger.warn(msg, meta);
  }
  error(msg: any, meta?: any) {
    this.logger.error(msg, meta);
  }
  fatal(msg: any, meta?: any) {
    this.logger.error('fatal', msg, meta);
  }
}

export const logger = new Logger();
