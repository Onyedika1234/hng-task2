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

const checkAvail = (req, res, next) => {
  const { value } = req.body;

  const exist = db.find((item) => item.value === value);
  if (exist)
    return res
      .status(409)
      .json({ success: false, error: "String analysis already exists" });

  next();
};

const validateQuery = (req, res, next) => {
  const { query } = req.query;
  if (!query || typeof query !== "string")
    return res.status(400).send("Invalid query parameter");

  next();
};
// Create string analysiers
app.post("/strings", validate, checkAvail, (req, res) => {
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

const parseNaturalLanguageQuery = (query) => {
  let filters = {};
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("palindrome")) {
    filters.is_palindrome = true;
  }
  if (lowerQuery.includes("length greater than")) {
    const match = lowerQuery.match(/length greater than (\d+)/);
  }
  if (lowerQuery.includes("single word")) {
    filters.word_count = 1;
  }
  if (lowerQuery.includes("contains_character")) {
    const match = lowerQuery.match(/contains_character (\w)/);
    if (match) {
      filters.contains_character = match[1];
    }
  }

  return filters;
};

console.log(
  parseNaturalLanguageQuery(
    "Find palindromes with length greater than 5 that are a single word"
  )
);
// Delete strings
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

app.get("/strings/filter-by-natural-language", validateQuery, (req, res) => {
  const { query } = req.query;
  try {
    const parsedFilters = parseNaturalLanguageQuery(query);

    const filtered = db.filter((item) => {
      for (let key in parsedFilters) {
        if (item.properties[key] !== parsedFilters[key]) {
          return false;
        }
      }
      return true;
    });

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error filtering reports" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
