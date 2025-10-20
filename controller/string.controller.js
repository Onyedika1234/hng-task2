import crypto from "crypto";
export const isPalindrome = (value) => {
  const lowerCased = value.toLowerCase();
  const reverse = [...lowerCased.split("")].reverse().join("");

  return reverse === lowerCased ? true : false;
};

export const getLength = (value) => {
  return value.length;
};

export const wordCount = (value) => {
  return value.split(" ").length;
};

export const specialCharacters = (value) => {
  const specialCharRegex = /[^A-Za-z0-9\s]/g;

  const matches = value.match(specialCharRegex);

  return matches ? matches.length : 0;
};

export const letterFrequency = (value) => {
  const cleanStr = value.toLowerCase().replace(/[^a-z]/g, "");
  let frequency = {};

  for (const char of cleanStr) {
    frequency[char] = (frequency[char] || 0) + 1;
  }
  return frequency;
};

export const generatesha = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};
