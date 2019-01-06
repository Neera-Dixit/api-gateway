import redis from 'redis';

const redisClient = redis.createClient();

redisClient.on('error', (error) => {
  logger.error(`error Connecting to Redis ${error}`);
});

redisClient.on('ready', () => {
  logger.info('Connected to redis client');
});

export default redisClient;
