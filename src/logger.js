/**
 * Node Logger
*/

import pinoLogger from 'pino';

const logger = pinoLogger({
  prettyPrint: { colorize: true },
});

export default logger;
