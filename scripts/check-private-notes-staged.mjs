#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { stripPrivateNotes } from "./strip-private-notes.mjs";

const TARGET_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".sass",
  ".json",
  ".mjs",
  ".cjs",
]);

const files = stagedFiles().filter(isTargetFile);
const leaked = [];

for (const file of files) {
  const stagedContent = readStagedFile(file);

  if (stagedContent !== null && stripPrivateNotes(stagedContent) !== stagedContent) {
    leaked.push(file);
  }
}

if (leaked.length > 0) {
  console.error("Private learning notes are still staged:");
  for (const file of leaked) {
    console.error(`  - ${file}`);
  }
  console.error("");
  console.error("Run `npm run notes:install`, then re-stage the files.");
  process.exit(1);
}

function stagedFiles() {
  const output = execFileSync(
    "git",
    ["diff", "--cached", "--name-only", "--diff-filter=ACMRT", "-z"],
    { encoding: "utf8" },
  );

  return output.split("\0").filter(Boolean);
}

function readStagedFile(file) {
  try {
    return execFileSync("git", ["show", `:${file}`], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 50,
    });
  } catch {
    return null;
  }
}

function isTargetFile(file) {
  const lower = file.toLowerCase();
  return [...TARGET_EXTENSIONS].some((extension) => lower.endsWith(extension));
}
