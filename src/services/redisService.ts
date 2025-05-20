import debug from "debug";
import redisClient from "../configs/redis";

const redisDebug = debug("service:redisService");

export const redisService = {

  // ? Parse the key to get the last number
  parseKey(key: string | number): string {
    if (typeof key === "number") return key.toString();
  
    const match = key.match(/(\d+)$/);
    return match ? match[1] : key;
  },

  // * Whitelist Token
  
  // Access Token
  async setAccessWhitelist(key: number | string, value: string, expirationInSeconds: number): Promise<boolean> {
    try {        
      const keyString = this.parseKey(key);
      const setResult = await redisClient.set(`whitelist:access:${keyString}`, value, { EX: expirationInSeconds });
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
  async getAccessWhitelist(key: string | number): Promise<string | null> {
    try {
      const keyString = this.parseKey(key);
      const getResult = await redisClient.get(`whitelist:access:${keyString}`);
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

  async deleteAccessWhitelist(key: string | number): Promise<number>{
    const keyString = this.parseKey(key);
    try {
      const delResult = await redisClient.del(`whitelist:access:${keyString}`);
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
  async setRefreshWhitelist(key: number | string, value: string, expirationInSeconds: number) {
    try {
      const keyString = this.parseKey(key);
      const setResult = await redisClient.set(`whitelist:refresh:${keyString}`, value, { EX: expirationInSeconds });
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
  async getRefreshWhitelist(key: string | number): Promise<string | null> {
    const keyString = this.parseKey(key);
    try {
      const getResult = await redisClient.get(`whitelist:refresh:${keyString}`);
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
  async deleteRefreshWhitelist(key: string | number): Promise<number> {
    const keyString = this.parseKey(key);
    try {
      const delResult = await redisClient.del(`whitelist:refresh:${keyString}`);
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
  async setTokenBlacklist(key: number | string, value: string, expirationInSeconds: number) {
    try {
      const keyString = this.parseKey(key);

      const setResult = await redisClient.set(`blacklist:token:${keyString}`, value, { EX: expirationInSeconds });

      if (setResult === "OK") {
        await this.deleteRefreshWhitelist(keyString);
        await this.deleteAccessWhitelist(keyString);
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

  async getTokenBlacklist(key: string | number): Promise<string | null> {
    try {
      const keyString = this.parseKey(key);

      const getResult = await redisClient.get(`blacklist:token:${keyString}`);
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

  async deleteTokenBlacklist(key: string | number): Promise<number> {
    try {
      const keyString = this.parseKey(key);

      const delResult = await redisClient.del(`blacklist:token:${keyString}`);
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
