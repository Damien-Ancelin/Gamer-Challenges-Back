import cloudinary from "configs/cloudinary";
import fs from "fs/promises";
import debug from "debug";

const cloudinaryDebug = debug("service:cloudinaryService");

export const cloudinaryService = {
  async uploadAvatar(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "avatars",
      });
      await fs.unlink(filePath);
      return result.secure_url;
    } catch (error) {
      cloudinaryDebug("❌ Erreur upload Cloudinary:", error);
      throw error;
    }
  },
};
