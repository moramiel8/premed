import "core-js/stable";
import "regenerator-runtime/runtime";

import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import errorHandler from '../middleware/errorHandler';

dotenv.config({ path: path.resolve(__dirname, '../.env') }) // server/.env FIRST
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: false }) // root fallback

const app = express();
app.set('trust proxy', 1);

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Check for required env variable
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env file");
  process.exit(1);
}

// CORS setup
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

// Security headers
app.use(helmet());
app.use(helmet.hidePoweredBy());

app.use('/api/version', require('../routes/api/version'))

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser());

// Serve static files in production
if (isProduction) {
  app.use(express.static(path.resolve(__dirname, '../../client/build')));
  app.get(/^(?!\/api\/).+/, (req, res) =>
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
  );
}

// Routes
import auth from './api/components/auth/routes';
import dataTables from './api/components/dataTables/routes';
import inquiries from './api/components/inquiries/routes';
import libraries from './api/components/library/routes';
import serverData from './api/components/serverData/routes';
import questions from './api/components/questions/routes';
import comments from './api/components/comments/routes';
import userdata from '../routes/api/user-data';
import steps from '../routes/api/steps';
import announcements from './api/components/announcements/announcements/routes';
import ancGroups from './api/components/announcements/groups/routes';
import viewIndex from './views/index';

app.use('/api/auth', auth);
app.use('/api/datatables', dataTables);
app.use('/api/inquiries', inquiries);
app.use('/api/libraries', libraries);
app.use('/api/serverdata', serverData);
app.use('/api/userdata', userdata);
app.use('/api/questions', questions);
app.use('/api/steps', steps);
app.use('/api/comments', comments);
app.use('/api/announcements', announcements);
app.use('/api/announcements/groups', ancGroups);
app.use('/api/service', viewIndex);

// View engine setup
app.set('view engine', 'hjs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hjs', require('hogan-express'));

// Global error handler (logging)
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Final error middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});
