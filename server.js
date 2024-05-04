require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3500;

// Old axios version ^1.6.8

// Cors
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/detect-image", async (req, res) => {
  console.log("request received");
  try {
    const { url } = req.body;
    console.log("url extrapulated", url);
    const PAT = process.env.CLARIFAI_PAT;
    const MODEL_ID = process.env.MODEL_ID;
    const MODEL_VERSION_ID = process.env.MODEL_VERSION;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: process.env.USER_ID,
        app_id: process.env.APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: url,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    const response = await fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      requestOptions
    );

    console.log(response);

    const data = await response.json();

    console.log("data", data);

    if (data.outputs && data.outputs[0] && data.outputs[0].data) {
      const imageData = data.outputs[0].data;
      res.json({ imageData });
    } else {
      throw new Error("Failed to generate image");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
