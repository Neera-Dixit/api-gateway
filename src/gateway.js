/**
 * Node API Gateway
 */

import express from 'express';
import httpProxy from 'express-http-proxy';
import rateLimit from 'express-rate-limit';
import logger from './logger';
import config from './config';
import cache from './cache';

global.logger = logger;

const { gatewayconfig, apiconfig } = config;
const nodeGateway = express();

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// apply to all requests
// Note : Igigitf you need for a specific route add it as a middleware
// Note : For redis store use rate-limit-redis
nodeGateway.use(apiRateLimiter);

// Code to manage handle APi's
for (const [api, mappings] of Object.entries(apiconfig)) {
  for (const apiMapConfig of mappings) {
    nodeGateway[apiMapConfig.requestType || 'get'](api, apiMapConfig.middlewares, (request, response, next) => {
      if (apiMapConfig.caching && cache) {
        cache.get(api, (error, cachedItem) => {
          if (!cachedItem) {
            httpProxy(api, {
              userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
                cache.set(api, proxyResData.toString('utf8'));
                return proxyResData;
              },
            });
          } else if (cachedItem) {
            response.json(cachedItem);
          } else if (error) {
            logger.info('Error while retrieving Data from Redis Cache');
            logger.error(error);
            httpProxy(api);
          }
        });
      } else {
        httpProxy(api);
      }
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
