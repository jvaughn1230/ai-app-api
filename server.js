require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3500;

// Cors
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/detect-color", async (req, res) => {
  try {
    const { url } = req.body;
    const PAT = process.env.CLARIFAI_PAT;
    const MODEL_ID = process.env.MODEL_ID;
    const MODEL_VERSION_ID = process.env.MODEL_VERSION;
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
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

    const data = await response.text();
    const parsedData = JSON.parse(data);

    const colorsArray = parsedData.outputs[0].data.colors;

    if (colorsArray) {
      res.json(colorsArray);
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
