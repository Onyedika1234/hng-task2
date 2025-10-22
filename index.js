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
  if (!query)
    return res.status(400).send("Unable to parse natural language query");

  if (typeof query !== "string")
    return res
      .status(422)
      .send("Query parsed but resulted in conflicting filters");
  next();
};

const parseNaturalLanguageQuery = (query) => {
  let filters = {};
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("palindromic")) {
    filters.is_palindrome = true;
  }
  if (lowerQuery.includes("longer than")) {
    const match = lowerQuery.match(/longer than (\d+)/);
    if (match) {
      filters.min_length = parseInt(match[1]) + 1;
    }
  }
  if (lowerQuery.includes("single word")) {
    filters.word_count = 1;
  }
  if (lowerQuery.includes("first vowel")) {
    filters.contains_character = "a";
  }
  if (lowerQuery.includes("containing the letter z")) {
    filters.contains_character = "z";
  }

  return filters;
};

// Create string analysiers

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

    res.status(200).json({
      filtered,
      count: filtered.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error filtering reports" });
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
        .json({ success: false, error: "String does not exist in the system" });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching report" });
  }
});

app.post("/strings", validate, checkAvail, (req, res) => {
  const { value } = req.body;
  try {
    const resBody = {
      id: generatesha(value),
      value,
      properties: {
        length: getLength(value),
        is_palindrome: isPalindrome(value),
        unique_characters: specialCharacters(value),
        word_count: wordCount(value),
        sha256_hash: generatesha(value),
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

// Delete strings
app.delete("/strings/:string_value", (req, res) => {
  const { string_value } = req.params;
  try {
    const record = db.find((item) => item.value === string_value);

    if (!record)
      return res
        .status(404)
        .json({ success: false, error: "String does not exist in the system" });

    db = db.filter((item) => item.value !== string_value);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting report" });
  }
});

const filteredString = (query) => {
  let result = db;

  if (query.min_length !== undefined) {
    result = result.filter((str) => str.properties.length >= query.min_length);
  }
  if (query.max_length !== undefined) {
    result = result.filter((str) => str.properties.length <= query.max_length);
  }
  if (query.is_palindrome !== undefined) {
    result = result.filter(
      (str) => str.properties.is_palindrome == query.is_palindrome
    );
  }
  if (query.word_count !== undefined) {
    result = result.filter(
      (str) => str.properties.word_count === query.word_count
    );
  }
  if (query.contains_character !== undefined) {
    result = result.filter((str) =>
      str.value.includes(query.contains_character.toLowerCase())
    );
  }
  return result;
};
app.get("/strings", (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  try {
    const query = {
      min_length: min_length ? parseInt(min_length) : undefined,
      max_length: max_length ? parseInt(max_length) : undefined,
      is_palindrome:
        is_palindrome !== undefined ? is_palindrome === "true" : undefined,
      word_count: word_count ? parseInt(word_count) : undefined,
      contains_character: contains_character ? contains_character : undefined,
    };

    const filtered = filteredString(query);
    res.status(200).json({
      data: filtered,
      count: filtered.length,
      filters_applied: {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid query parameter values or types" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
