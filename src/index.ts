import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import path from "node:path";

import { apiRouter } from './routes/index';
import { initializeDb } from './configs/sequelize';
import { configureHelmet } from 'configs/helmet';
import { configureCors } from 'configs/cors';
import { errorHandler } from 'middlewares/errorHandler';
import { notFoundHandler } from 'middlewares/notFoundHandler';
import { checkRoutesPermission } from 'middlewares/checkRoutesPermission';

const app = express();
const port = process.env.API_PORT || 3000;

await initializeDb();

// Middleware
configureHelmet(app);
app.use(configureCors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
const __dirname = path.resolve(); // Assure que __dirname est défini correctement
const uploadDir = path.join(__dirname, "uploads"); // Chemin vers le dossier de téléchargement
app.use("/uploads", express.static(uploadDir));

// Morgan logging middleware
// Morgan is a logging library for Node.js HTTP servers
process.env.NODE_ENV === "production"
  ? app.use(morgan('combined'))
  : app.use(morgan('dev'));

// Security check middleware
app.use(checkRoutesPermission);

// API Routes
app.use("/api", apiRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});