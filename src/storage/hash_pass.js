import fs from "fs";
import path from "path";
import md5 from "md5"; // direct import here to avoid `.ts` interop issues

const command = process.argv[2];
const rawPassword = process.argv[3];

if (!command || !rawPassword) {
  console.error("Usage: node hash_pass.js <add|remove> <password>");
  process.exit(1);
}

const hashed = md5(rawPassword);
const storePath = path.resolve("./password_store.json");

// Load existing password hashes
let hashes = [];

if (fs.existsSync(storePath)) {
  try {
    hashes = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  } catch (err) {
    console.error("Failed to parse password_store.json:", err);
    process.exit(1);
  }
}

if (command === "add") {
  if (hashes.includes(hashed)) {
    console.log("Hash already exists.");
  } else {
    hashes.push(hashed);
    fs.writeFileSync(storePath, JSON.stringify(hashes, null, 2), "utf-8");
    console.log("Password hash added:", hashed);
  }
} else if (command === "remove") {
  if (!hashes.includes(hashed)) {
    console.log("Hash not found in store.");
  } else {
    hashes = hashes.filter(h => h !== hashed);
    fs.writeFileSync(storePath, JSON.stringify(hashes, null, 2), "utf-8");
    console.log("Password hash removed:", hashed);
  }
} else {
  console.error("Invalid command. Use 'add' or 'remove'.");
  process.exit(1);
}
