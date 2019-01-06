/**
 * Node API Gateway
 */

import express from 'express';
import httpProxy from 'express-http-proxy';
import logger from './logger';
import config from './config';

const { gatewayconfig, apiconfig } = config;
const nodeGateway = express();

// Code to manage handle APi's
for (const [api, mappings] of Object.entries(apiconfig)) {
  for (const apiMapConfig of mappings) {
    nodeGateway[apiMapConfig.requestType || 'get'](api, apiMapConfig.middlewares, (request, response, next) => {
      httpProxy(api);
    });
  }
}

nodeGateway.listen(gatewayconfig.PORT, (error) => {
  if (error) {
    logger.error(error);
    logger.info('Node API Gateway failed to start');
  } else {
    logger.info(`Node API Gateway started at Port ${gatewayconfig.PORT}`);
  }
});
