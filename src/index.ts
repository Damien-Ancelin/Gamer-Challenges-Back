import express from 'express';
import { router } from './Routes/index';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import "dotenv/config";

// ! Test redis connection
import redisClient from './configs/redis';
console.log(redisClient);

const app = express();
const port = process.env.API_PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logging middleware
// Morgan is a logging library for Node.js HTTP servers
process.env.NODE_ENV === "production"
  ? app.use(morgan('combined'))
  : app.use(morgan('dev'));

// Routes
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});