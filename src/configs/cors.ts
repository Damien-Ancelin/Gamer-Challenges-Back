import cors from 'cors';
import debug from 'debug';

const corsDebug = debug('config:cors')

export const configureCors = () => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const FRONTEND_PREVIEW_URL= process.env.FRONTEND_PREVIEW_URL;
  const API_URL = process.env.API_URL;
  const API_URL_TEST = process.env.API_URL_TEST;

  if (!FRONTEND_URL || !API_URL) {
    if(process.env.NODE_ENV !== "production") {
      corsDebug("⚠️ FRONTEND_URL or API_URL is not defined in environment variables.");
      console.warn("⚠️ FRONTEND_URL or API_URL is not defined in environment variables.");
    }
    throw new Error("une erreur est survenue");
  }
  
  return cors({
    origin: [FRONTEND_URL, API_URL, API_URL_TEST, FRONTEND_PREVIEW_URL].filter((url): url is string => Boolean(url)), // Filtrer les valeurs undefined
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // HTTP Method allowed
    credentials: true, // Autorize sending cookies
  });
};