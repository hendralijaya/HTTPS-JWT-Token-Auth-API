const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const connectDB = require("./database/connection");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkAccount } = require("./middleware/authMiddleware");

const app = express();
dotenv.config({ path: "config.env" });

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// use template engine ejs
app.set("view engine", "ejs");

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

sslServer.listen(process.env.port, () => {
  console.log(`Secure server is listening on https://localhost:${process.env.port}`);
});

// mongodb connection
connectDB();

// routes
app.get(`*`, checkAccount);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
