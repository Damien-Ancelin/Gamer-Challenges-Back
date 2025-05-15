import { createClient } from "redis";

import debug from "debug";

const redisDebug = debug("config:redisConnexion");

const redisURL = process.env.REDIS_URL;

const redisClient = createClient({ url: redisURL })

redisClient.on('connect', () => {
  redisDebug('✅ Redis online !');
});

redisClient.on('error', (error) => {
  redisDebug('❌ Redis error:', error);
});

redisClient.connect();

export default redisClient;