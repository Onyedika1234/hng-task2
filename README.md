# **String Analysis API** 🔍

## Overview

A robust Node.js Express API engineered to provide comprehensive string analysis capabilities. This backend service allows users to submit strings, obtain various analytical properties (such as length, palindrome status, word count, character frequency, and SHA256 hash), and manage these analyses through CRUD operations, including advanced filtering. Built using Express.js for routing and a simple in-memory database for persistence.

## Key Project Features

✨ **Comprehensive String Analysis**: Automatically calculates length, detects palindromes, counts words and special characters, determines character frequencies, and generates SHA256 hashes for any submitted string.
💾 **Data Management**: Supports creation, retrieval, and deletion of string analysis reports.
🔍 **Advanced Filtering**: Allows searching for string analyses based on properties like palindrome status, length range, word count, or character presence.
🗣️ **Natural Language Query**: Includes an experimental endpoint to filter analyses using natural language prompts.
🛡️ **Input Validation**: Ensures data integrity with middleware for validating string input.

## Features

- `Express.js`: Powers the RESTful API endpoints and handles routing.
- `CORS`: Manages Cross-Origin Resource Sharing for secure communication.
- `Dotenv`: Facilitates loading environment variables for configuration.
- `UUID`: Generates unique identifiers for each string analysis report.
- `Crypto`: Utilized for generating secure SHA256 hashes of input strings.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Onyedika1234/hng-task2.git
    ```
2.  **Navigate to the Project Directory**:
    ```bash
    cd hng-task2
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Start the Development Server**:
    ```bash
    npm run dev
    # or to run without nodemon
    node index.js
    ```
    The server will typically run on `http://localhost:3000` or the port specified in your `.env` file.

### Environment Variables

Create a `.env` file in the root of your project and add the following variable:

```
PORT=3000
```

- `PORT`: The port on which the server will listen. Defaults to `3000` if not specified.

## Technologies Used

| Technology   | Version  | Description                                     |
| :----------- | :------- | :---------------------------------------------- |
| `Node.js`    | ^18.x    | JavaScript runtime environment                  |
| `Express.js` | ^5.1.0   | Web application framework                       |
| `dotenv`     | ^17.2.3  | Loads environment variables from `.env` file    |
| `cors`       | ^2.8.5   | Provides middleware for CORS                    |
| `uuid`       | ^13.0.0  | For generating RFC4122 UUIDs                    |
| `crypto`     | Built-in | Node.js built-in module for hashing             |
| `nodemon`    | ^3.1.10  | Auto-restarts server on file changes (dev only) |

## API Documentation

### Base URL

`http://localhost:3000` (or your configured port)

### Endpoints

#### POST /strings

Creates a new string analysis report.

**Request**:

```json
{
  "value": "string"
}
```

- `value`: The string to be analyzed. (Required, string)

**Response**:

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 0,
    "word_count": 2,
    "sha256_code": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b27796ad9f146e",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `400 Bad Request`: `{ "success": false, "error": "No data provided" }` (if `value` is missing)
- `422 Unprocessable Entity`: `{ "success": false, "error": "Data must be a string" }` (if `value` is not a string)
- `409 Conflict`: `{ "success": false, "error": "String analysis already exists" }` (if `value` already exists in the database)
- `500 Internal Server Error`: `{ "success": false, "error": "Error creating report" }`

#### GET /strings/:string_value

Retrieves a specific string analysis report by its value.

**Request**:
(None, `string_value` is a path parameter)

**Response**:

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 0,
    "word_count": 2,
    "sha256_code": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b27796ad9f146e",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `404 Not Found`: `{ "success": false, "error": "Report not found" }`
- `500 Internal Server Error`: `{ "success": false, "error": "Error fetching report" }`

#### DELETE /strings/:string_value

Deletes a string analysis report by its value.

**Request**:
(None, `string_value` is a path parameter)

**Response**:
`204 No Content` (Successful deletion with no response body)

**Errors**:

- `500 Internal Server Error`: `{ "success": false, "error": "Error deleting report" }`

#### GET /strings

Retrieves a list of string analysis reports with filtering capabilities based on specific properties.

**Request**:
Query Parameters:

- `is_palindrome`: Filter by palindrome status (`true` or `false` as string). (Required)
- `min_length`: Minimum length of the string. (Required, number as string)
- `max_length`: Maximum length of the string. (Required, number as string)
- `word_count`: Exact word count of the string. (Required, number as string)
- `contains_character`: Filter by strings containing a specific character. (Required, string)

**Response**:

```json
[
  {
    "id": "f2e3d4c5-b6a7-8901-2345-67890abcdef0",
    "value": "madam",
    "properties": {
      "length": 5,
      "is_palindrome": true,
      "unique_characters": 0,
      "word_count": 1,
      "sha256_code": "d4b005e834927f1cfd74e304892c5567b55f190e292022416b7f334a17387498",
      "character_frequency_map": {
        "m": 2,
        "a": 2,
        "d": 1
      }
    },
    "created_at": "2023-10-27T10:05:00.000Z"
  }
]
```

**Errors**:

- `400 Bad Request`: `Invalid query parameters values or types` (if any required query parameter is missing or has an invalid type)
- `500 Internal Server Error`: `{ "success": false, "error": "Error filtering reports" }`

#### GET /strings/filter-by-natural-language

Retrieves a list of string analysis reports by parsing a natural language query.

**Request**:
Query Parameter:

- `query`: A natural language string describing the desired filters (e.g., "Find palindromes with length greater than 5 that are a single word"). (Required, string)

**Response**:

```json
[
  {
    "id": "g3h4i5j6-k7l8-9012-3456-7890abcdef12",
    "value": "racecar",
    "properties": {
      "length": 7,
      "is_palindrome": true,
      "unique_characters": 0,
      "word_count": 1,
      "sha256_code": "729227c191a18d172e259e31d4d620593b4f620f46c3b6f0e3f2e1b1d1f0e2d3",
      "character_frequency_map": {
        "r": 2,
        "a": 2,
        "c": 2,
        "e": 1
      }
    },
    "created_at": "2023-10-27T10:10:00.000Z"
  }
]
```

**Errors**:

- `400 Bad Request`: `Invalid query parameter` (if `query` is missing or not a string)
- `500 Internal Server Error`: `{ "success": false, "error": "Error filtering reports" }`

## Usage Examples

Here are some examples of how to interact with the String Analysis API using `curl`.

### Create a String Analysis

```bash
curl -X POST \
  http://localhost:3000/strings \
  -H 'Content-Type: application/json' \
  -d '{
        "value": "Hello World"
      }'
```

### Create a Palindrome String Analysis

```bash
curl -X POST \
  http://localhost:3000/strings \
  -H 'Content-Type: application/json' \
  -d '{
        "value": "madam"
      }'
```

### Get a Specific String Analysis

```bash
curl -X GET \
  http://localhost:3000/strings/Hello%20World
```

### Filter String Analyses

Filter for palindromes with a word count of 1, length between 1 and 10, containing the character 'a'.

```bash
curl -X GET \
  "http://localhost:3000/strings?is_palindrome=true&min_length=1&max_length=10&word_count=1&contains_character=a"
```

### Filter with Natural Language

```bash
curl -X GET \
  "http://localhost:3000/strings/filter-by-natural-language?query=Find%20palindromes%20that%20are%20a%20single%20word"
```

### Delete a String Analysis

```bash
curl -X DELETE \
  http://localhost:3000/strings/Hello%20World
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or want to report a bug, please follow these steps:

🐛 **Report a Bug**: Open an issue describing the bug and steps to reproduce.
💡 **Suggest a Feature**: Open an issue detailing your proposed feature.
🛠️ **Submit a Pull Request**: 1. Fork the repository. 2. Create a new branch (`git checkout -b feature/your-feature-name`). 3. Make your changes and ensure tests pass (if any). 4. Commit your changes (`git commit -m 'feat: Add new feature'`). 5. Push to the branch (`git push origin feature/your-feature-name`). 6. Open a pull request describing your changes.

Please ensure your code adheres to the project's coding style and includes appropriate documentation.

## License

This project is open-sourced under the ISC License.

## Author Info

👋 **Your Name**

- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your_username)
- Twitter: [@your_twitter_handle](https://twitter.com/your_twitter_handle)

## Badges

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue?logo=express)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
