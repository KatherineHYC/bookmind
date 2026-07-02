#!/usr/bin/env node

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const hookPath = join(root, ".git", "hooks", "pre-commit");

execFileSync("git", ["config", "--local", "filter.private-notes.clean", "node scripts/strip-private-notes.mjs"], {
  cwd: root,
  stdio: "inherit",
});
execFileSync("git", ["config", "--local", "filter.private-notes.smudge", "cat"], {
  cwd: root,
  stdio: "inherit",
});
execFileSync("git", ["config", "--local", "filter.private-notes.required", "true"], {
  cwd: root,
  stdio: "inherit",
});

mkdirSync(dirname(hookPath), { recursive: true });
writeFileSync(
  hookPath,
  [
    "#!/bin/sh",
    "",
    "node scripts/check-private-notes-staged.mjs",
    "",
  ].join("\n"),
);
chmodSync(hookPath, 0o755);

console.log("Private learning note Git filter and pre-commit hook installed.");
