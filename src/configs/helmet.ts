import helmet from 'helmet';
import debug from 'debug';
import { Express } from 'express';

const helmetDebug = debug('config:helmet')

export const configureHelmet = (app: Express) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const API_URL = process.env.API_URL;

  if (!FRONTEND_URL || !API_URL) {
    if(process.env.NODE_ENV !== "production") {
      helmetDebug("⚠️ FRONTEND_URL or API_URL is not defined in environment variables.");
      console.warn("⚠️ FRONTEND_URL or API_URL is not defined in environment variables.");
    }
    throw new Error("une erreur est survenue");
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // Allow only self for default
          imgSrc: ["'self'", "data:", String(process.env.FRONTEND_URL)], // Allow images from self and data URIs
          connectSrc: ["'self'", String(process.env.API_URL)], // Allow connections to self and API URL
          frameSrc: ["'none'"], // Block all frames
          objectSrc: ["'none'"], // Block all objects
          mediaSrc: ["'self'"], // Allow media from self
        },
      },
      frameguard: { action: "deny" }, // clickjacking protection 
      noSniff: true, // Prevent MIME type sniffing
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Referrer policy
    })
  );
};