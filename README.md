# 🚀 String Analyzer API

## Overview

A robust Node.js Express.js backend API designed for comprehensive string analysis, featuring functionalities like palindrome detection, character frequency mapping, SHA256 hashing, and natural language query filtering. It provides a RESTful interface to process and retrieve string-related data, utilizing an in-memory database for efficient, transient storage of analysis reports.

## Features

- **Express.js**: Building a high-performance and scalable RESTful API.
- **Node.js**: Asynchronous and event-driven JavaScript runtime for efficient server operations.
- **CORS**: Securely enabling Cross-Origin Resource Sharing for API accessibility.
- **dotenv**: Managing environment-specific configurations securely and efficiently.
- **SHA256 Hashing**: Generating unique, immutable identifiers for each string analysis report.
- **In-Memory Database**: Providing efficient, transient storage for string analysis records.
- **Input Validation**: Ensuring data integrity and preventing malformed requests through robust validation middleware.
- **Natural Language Query Processing**: Offering advanced filtering capabilities for string data using human-readable queries.
- **Detailed String Metrics**: Automatically computing length, word count, special character count, and character frequency maps.
- **Palindrome Detection**: Identifying palindromic strings with a dedicated analytical function.

## Getting Started

To get this String Analyzer API up and running locally, follow these steps.

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
    ```

### Environment Variables

Create a `.env` file in the root of the project and define the following variable:

- `PORT`: The port number on which the server will listen.
  _Example_:
  ```
  PORT=3000
  ```

## Usage

After installation and setting up environment variables, you can start the server.

To run the server in development mode (with Nodemon for automatic restarts):

```bash
npm run dev
```

To run the server in production mode:

```bash
npm start
```

Once the server is running, you can interact with the API using tools like cURL, Postman, or your preferred HTTP client.

_Example - Creating a string analysis report:_

```bash
curl -X POST -H "Content-Type: application/json" -d '{"value": "madam"}' http://localhost:3000/strings
```

_Example - Retrieving a string analysis report:_

```bash
curl http://localhost:3000/strings/madam
```

## API Documentation

### Base URL

`http://localhost:[PORT]`

### Endpoints

#### POST /strings

Creates a new string analysis report and stores it in the in-memory database.

**Request**:

```json
{
  "value": "string"
}
```

**Response**:

```json
{
  "id": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 0,
    "word_count": 1,
    "sha256_code": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
    "character_frequency_map": {
      "m": 2,
      "a": 2,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `400 Bad Request`: No data provided.
- `422 Unprocessable Entity`: Data must be a string.
- `409 Conflict`: String analysis already exists.
- `500 Internal Server Error`: Error creating report.

#### GET /strings/:string_value

Retrieves a specific string analysis report by its `value`.

**Request**:
No request body required. `string_value` is passed as a URL parameter.

**Response**:

```json
{
  "id": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 0,
    "word_count": 1,
    "sha256_code": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
    "character_frequency_map": {
      "m": 2,
      "a": 2,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `404 Not Found`: String does not exist in the system.
- `500 Internal Server Error`: Error fetching report.

#### DELETE /strings/:string_value

Deletes a specific string analysis report by its `value`.

**Request**:
No request body required. `string_value` is passed as a URL parameter.

**Response**:
`204 No Content` (Successful deletion with no content returned).

**Errors**:

- `404 Not Found`: String does not exist in the system.
- `500 Internal Server Error`: Error deleting report.

#### GET /strings

Retrieves a list of string analysis reports filtered by specific query parameters. All query parameters are mandatory for this endpoint.

**Request**:
Query Parameters:

- `is_palindrome`: `true` or `false` (string boolean)
- `min_length`: Minimum length (integer)
- `max_length`: Maximum length (integer)
- `word_count`: Exact word count (integer)
- `contains_character`: A character the string must contain (string)

**Response**:

```json
{
  "data": [
    {
      "id": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 0,
        "word_count": 1,
        "sha256_code": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:00:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": "1",
    "max_length": "10",
    "word_count": "1",
    "contains_character": "a"
  }
}
```

**Errors**:

- `400 Bad Request`: Missing query parameters.
- `500 Internal Server Error`: Error filtering reports (not explicitly handled in code, but good to anticipate).

#### GET /strings/filter-by-natural-language

Filters string analysis reports based on a natural language query.

**Request**:
Query Parameters:

- `query`: A natural language string for filtering (e.g., "palindromic strings longer than 3 containing the letter z").

**Response**:

```json
{
  "filtered": [
    {
      "id": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 0,
        "word_count": 1,
        "sha256_code": "e63a3d5b78b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:00:00.000Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "palindromic strings longer than 3",
    "parsed_filters": {
      "is_palindrome": true,
      "min_length": 4
    }
  }
}
```

**Errors**:

- `400 Bad Request`: Unable to parse natural language query (missing `query` parameter).
- `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters (query is not a string).
- `500 Internal Server Error`: Error filtering reports.

## Technologies Used

| Technology     | Description                                                                 | Link                                                             |
| :------------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **Node.js**    | JavaScript runtime built on Chrome's V8 JavaScript engine.                  | [nodejs.org](https://nodejs.org/)                                |
| **Express.js** | Fast, unopinionated, minimalist web framework for Node.js.                  | [expressjs.com](https://expressjs.com/)                          |
| **dotenv**     | Loads environment variables from a `.env` file.                             | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) |
| **cors**       | Provides a Connect/Express middleware for CORS.                             | [npmjs.com/package/cors](https://www.npmjs.com/package/cors)     |
| **uuid**       | For the creation of RFC4122 UUIDs.                                          | [npmjs.com/package/uuid](https://www.npmjs.com/package/uuid)     |
| **nodemon**    | Automatically restarts the node application when file changes are detected. | [nodemon.io](https://nodemon.io/)                                |

## Contributing

We welcome contributions to the String Analyzer API! If you're interested in improving this project, please follow these guidelines:

✨ **Fork the Repository**: Start by forking the project to your own GitHub account.

🌿 **Create a New Branch**: Create a new branch for your feature or bug fix:
`git checkout -b feature/your-feature-name` or `bugfix/issue-description`

💡 **Implement Your Changes**: Write clean, well-documented code.

✅ **Test Your Changes**: Ensure your changes don't introduce new issues and existing functionalities remain intact.

⬆️ **Commit and Push**: Commit your changes with a clear message and push them to your forked repository.

➡️ **Open a Pull Request**: Submit a pull request to the `main` branch of this repository, describing your changes and their benefits.

## License

This project is licensed under the ISC License. See the [SPDX License List](https://spdx.org/licenses/ISC.html) for more details.

## Author

**Onyedika**

- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/onyedika)
- **Twitter**: [Your Twitter Handle](https://twitter.com/onyedika)
- **Portfolio**: [Your Portfolio Website](https://your-portfolio.com)

---

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue.svg)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
