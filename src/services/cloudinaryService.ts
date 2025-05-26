import cloudinary from "configs/cloudinary";
import fs from "fs/promises";
import debug from "debug";

const cloudinaryDebug = debug("service:cloudinaryService");

export const cloudinaryService = {

  // * Upload avatar image
  async uploadAvatar(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "avatars",
        transformation: [
          { width: 240, height: 240, crop: "fill" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });
      await fs.unlink(filePath);
      return result.secure_url;
    } catch (error) {
      cloudinaryDebug("❌ Erreur upload avatar Cloudinary:", error);
      throw error;
    }
  },

  // * Upload challenge image
  async uploadChallengeImage(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "challenges_images",
        transformation: [
          { width: 240, height: 240, crop: "fill" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });
      await fs.unlink(filePath);
      return result.secure_url;
    } catch (error) {
      cloudinaryDebug("❌ Erreur upload challenge image Cloudinary:", error);
      throw error;
    }
  },
};
