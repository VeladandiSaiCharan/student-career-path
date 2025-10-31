import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = 3000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  next();
});
// Serve static files
app.use(express.static(path.join(__dirname)));

// AI-Related Functions have been temporarily removed and will be reimplemented later

// Configure CORS for development
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    console.warn('Blocked CORS request from origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

// Basic endpoints for service status
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Temporary disabled endpoints with proper response
app.post("/api/chatbot", (req, res) => {
  res.status(503).json({ 
    error: "Chatbot service is temporarily unavailable",
    message: "This feature is currently under maintenance"
  });
});

app.post("/api/recommend", (req, res) => {
  res.status(503).json({ 
    error: "Recommendations service is temporarily unavailable",
    message: "This feature is currently under maintenance"
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
