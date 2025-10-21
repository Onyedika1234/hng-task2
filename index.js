import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { validate } from "./middleware/validate.middleware.js";
import {
  isPalindrome,
  getLength,
  wordCount,
  specialCharacters,
  letterFrequency,
  generatesha,
} from "./controller/string.controller.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

let db = [];

// Create string analysiers
app.post("/strings", validate, (req, res) => {
  const { value } = req.body;
  const id = uuidv4();
  try {
    const resBody = {
      id,
      value,
      properties: {
        length: getLength(value),
        is_palindrome: isPalindrome(value),
        unique_characters: specialCharacters(value),
        word_count: wordCount(value),
        sha256_code: generatesha(value),
        character_frequency_map: letterFrequency(value),
      },
      created_at: new Date().toISOString(),
    };
    db.push(resBody);
    res.status(201).json(resBody);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error creating report" });
  }
});

// Get specific string
app.get("/strings/:string_value", (req, res) => {
  const { string_value } = req.params;

  try {
    const record = db.find((item) => item.value === string_value);
    if (!record)
      return res
        .status(404)
        .json({ success: false, error: "Report not found" });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching report" });
  }
});

app.delete("/strings/:string_value", (req, res) => {
  const { string_value } = req.params;
  try {
    db = db.filter((item) => item.value !== string_value);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting report" });
  }
});

app.get("/strings", (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  if (
    !is_palindrome ||
    !min_length ||
    !max_length ||
    !word_count ||
    !contains_character
  )
    return res.status(400).send("Invalid query parameters values or types");

  const filtered = db.filter(
    (item) =>
      item.properties.is_palindrome.toString() === is_palindrome &&
      item.properties.length >= parseInt(min_length) &&
      item.properties.length <= parseInt(max_length) &&
      item.properties.word_count === parseInt(word_count) &&
      item.value.includes(contains_character)
  );
  res.status(200).json(filtered);
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
