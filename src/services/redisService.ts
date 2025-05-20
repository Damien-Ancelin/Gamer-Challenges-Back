import debug from "debug";
import redisClient from "../configs/redis";

const redisDebug = debug("service:redisService");

export const redisService = {
  // * Whitelist Token
  
  // Access Token
  async setAccessWhitelist(key: string, value: string, expirationInSeconds: number) {
    try {        
      const setResult = await redisClient.set(`whitelist:access:${key}`, value, { EX: expirationInSeconds });
      if (setResult === "OK") {
        redisDebug("✔ Access whitelist key set successfully");
        return true; // Key set successfully
      } else {
        redisDebug("❌ Failed to set access whitelist key");
        return false; // Failed to set key
      }
    } catch (error) {
      redisDebug("❌ Error setting whitelist key:", error);
      throw new Error("Failed to set access whitelist key");
    }
  },
  async getAccessWhitelist(key: string): Promise<string | null> {
    try {
      const getResult = await redisClient.get(`whitelist:access:${key}`);
      if (getResult === null) {
        redisDebug("✔ Access whitelist key not found");
        return null; // Key not found
      }
      redisDebug("✔ Access whitelist key retrieved successfully");
      return getResult;
    } catch (error) {
      redisDebug("❌ Error getting access whitelist key:", error);
      throw new Error("Failed to get access whitelist key");
    }
  },
  async deleteAccessWhitelist(key: string): Promise<number>{
    try {
      const delResult = await redisClient.del(`whitelist:access:${key}`);
      if (delResult === 0) {
        redisDebug("✔ Access whitelist key not found");
        return 0; // Key not found
      }
      redisDebug("✔ Access whitelist key deleted successfully");
      return 1; // Key deleted successfully
    } catch (error) {
      redisDebug("❌ Error deleting access whitelist key:", error);
      throw new Error("Failed to delete access whitelist key");
    }
  },

  // Refresh Token
  async setRefreshWhitelist(key: string, value: string, expirationInSeconds: number) {
    try {
      const setResult = await redisClient.set(`whitelist:refresh:${key}`, value, { EX: expirationInSeconds });
      if (setResult === "OK") {
        redisDebug("✔ Refresh token key set successfully");
        return true; // Key set successfully
      } else {
        redisDebug("❌ Failed to set refresh token key");
        return false; // Failed to set key
      }
    } catch (error) {
      redisDebug("❌ Error setting refresh token key:", error);
      throw new Error("Failed to set refresh token key");
    }
  },
  async getRefreshWhitelist(key: string): Promise<string | null> {
    try {
      const getResult = await redisClient.get(`whitelist:refresh:${key}`);
      if (getResult === null) {
        redisDebug("✔ Refresh token key not found");
        return null; // Key not found
      }
      redisDebug("✔ Refresh token key retrieved successfully");
      return getResult;
    } catch (error) {
      redisDebug("❌ Error getting refresh token key:", error);
      throw new Error("Failed to get refresh token key");
    }
  },
  async deleteRefreshWhitelist(key: string): Promise<number> {
    try {
      const delResult = await redisClient.del(`whitelist:refresh:${key}`);
      if (delResult === 0) {
        redisDebug("✔ Refresh token key not found");
        return 0; // Key not found
      }
      redisDebug("✔ Refresh token key deleted successfully");
      return 1; // Key deleted successfully
    } catch (error) {
      redisDebug("❌ Error deleting refresh token key:", error);
      throw new Error("Failed to delete refresh token key");
    }
  },

  // * Blacklist Token
  async setTokenBlacklist(key: string, value: string, expirationInSeconds: number) {
    try {
      if (!key.includes("access") || !key.includes("refresh")) {
        redisDebug("❌ Invalid key format");
        throw new Error("Invalid key format");
      }

      const setResult = await redisClient.set(`blacklist:token:${key}`, value, { EX: expirationInSeconds });

      if (setResult === "OK") {
        await redisService.deleteRefreshWhitelist(key);
        await redisService.deleteAccessWhitelist(key);
        redisDebug("✔ Access blacklist key set successfully");
        return true; // Key set successfully

      } else {
        redisDebug("❌ Failed to set access blacklist key");
        return false; // Failed to set key
      }
    } catch (error) {
      redisDebug("❌ Error setting access blacklist key:", error);
      throw new Error("Failed to set access blacklist key");
    }
  },

  async getTokenBlacklist(key: string): Promise<string | null> {
    try {
      const getResult = await redisClient.get(`blacklist:token:${key}`);
      if (getResult === null) {
        redisDebug("✔ Access blacklist key not found");
        return null; // Key not found
      }
      redisDebug("✔ Access blacklist key retrieved successfully");
      return getResult;
    } catch (error) {
      redisDebug("❌ Error getting access blacklist key:", error);
      throw new Error("Failed to get access blacklist key");
    }
  },

  async deleteTokenBlacklist(key: string): Promise<number> {
    try {
      const delResult = await redisClient.del(`blacklist:token:${key}`);
      if (delResult === 0) {
        redisDebug("✔ Access blacklist key not found");
        return 0; // Key not found
      }
      redisDebug("✔ Access blacklist key deleted successfully");
      return 1; // Key deleted successfully
    } catch (error) {
      redisDebug("❌ Error deleting access blacklist key:", error);
      throw new Error("Failed to delete access blacklist key");
    }
  },
};
