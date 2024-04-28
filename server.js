const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const app = express();
const PORT = process.env.PORT || 3500;

// Cors
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
