import "dotenv/config";
import debug from "debug";

import sequelize from "../configs/sequelize";
import redisClient from "configs/redis";

const sequelizeDebug = debug("migration:sequelize");

(async () => {
  sequelizeDebug("🔄 Starting database sync...");
  try {
    await sequelize.drop();
    sequelizeDebug("✅ All models were dropped successfully.");
  } catch (error) {
    sequelizeDebug("❌ Error dropping database:", (error as Error).message);
  }

  try {
    await sequelize.sync(); // { force: true } si besoin
    sequelizeDebug("✅ All models were synchronized successfully.");
  } catch (error) {
    sequelizeDebug("❌ Error syncing database:", (error as Error).message);
  } finally {
    sequelizeDebug(process.env.REDIS_URL);
    await redisClient.quit();
    await sequelize.close();
  }
})();
