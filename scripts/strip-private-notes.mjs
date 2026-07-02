#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const INLINE_TAGS = new Set(["NOTE", "WHY"]);
const BLOCK_TAGS = new Set(["EXPLAIN", "TODO"]);

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const input = readFileSync(0, "utf8");
  const output = stripPrivateNotes(input);

  process.stdout.write(output);
}

export function stripPrivateNotes(source) {
  let output = "";
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "'" || char === '"') {
      const end = consumeQuoted(source, index, char);
      output += source.slice(index, end);
      index = end;
      continue;
    }

    if (char === "`") {
      const end = consumeTemplate(source, index);
      output += source.slice(index, end);
      index = end;
      continue;
    }

    if (char === "/" && next === "/") {
      const lineEnd = findLineEnd(source, index + 2);
      const comment = source.slice(index, lineEnd);

      if (isPrivateInlineComment(comment)) {
        if (isOnlyHorizontalWhitespaceAfterLastLineBreak(output)) {
          output = trimHorizontalWhitespace(output);
          index = consumeLineBreak(source, lineEnd);
          continue;
        }

        output = trimHorizontalWhitespace(output);
      } else {
        output += comment;
      }

      index = lineEnd;
      continue;
    }

    if (char === "/" && next === "*") {
      const blockEnd = source.indexOf("*/", index + 2);

      if (blockEnd === -1) {
        output += source.slice(index);
        break;
      }

      const end = blockEnd + 2;
      const comment = source.slice(index, end);

      if (isPrivateBlockComment(comment)) {
        output = trimHorizontalWhitespace(output);
        index = isOnlyHorizontalWhitespaceAfterLastLineBreak(output)
          ? consumeLineBreak(source, end)
          : end;
        continue;
      }

      output += comment;
      index = end;
      continue;
    }

    output += char;
    index += 1;
  }

  return output;
}

function consumeQuoted(source, start, quote) {
  let index = start + 1;

  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
      continue;
    }

    if (source[index] === quote) {
      return index + 1;
    }

    index += 1;
  }

  return source.length;
}

function consumeTemplate(source, start) {
  let index = start + 1;

  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
      continue;
    }

    if (source[index] === "`") {
      return index + 1;
    }

    index += 1;
  }

  return source.length;
}

function findLineEnd(source, start) {
  const newline = source.indexOf("\n", start);
  return newline === -1 ? source.length : newline;
}

function isPrivateInlineComment(comment) {
  const text = comment.slice(2).trimStart();
  const tag = readTag(text);
  return tag !== null && INLINE_TAGS.has(tag.name) && tag.boundary;
}

function isPrivateBlockComment(comment) {
  const lines = comment.split(/\r?\n/).map((line) => line.trim());

  if (lines.length < 4 || lines[0] !== "/* ============================================================================") {
    return false;
  }

  const tagLine = lines.find((line) => line.startsWith("* @"));

  if (tagLine === undefined) {
    return false;
  }

  const tag = readTag(tagLine.slice(2).trimStart());

  return tag !== null && BLOCK_TAGS.has(tag.name) && tag.boundary;
}

function readTag(text) {
  if (!text.startsWith("@")) {
    return null;
  }

  let index = 1;

  while (index < text.length && /[A-Z]/.test(text[index])) {
    index += 1;
  }

  const name = text.slice(1, index);
  const next = text[index];

  return {
    name,
    boundary: next === undefined || /\s|:/.test(next),
  };
}

function trimHorizontalWhitespace(text) {
  return text.replace(/[ \t]+$/, "");
}

function isOnlyHorizontalWhitespaceAfterLastLineBreak(text) {
  const lastLineBreak = Math.max(text.lastIndexOf("\n"), text.lastIndexOf("\r"));
  const currentLine = text.slice(lastLineBreak + 1);
  return /^[ \t]*$/.test(currentLine);
}

function consumeLineBreak(source, index) {
  if (source[index] === "\r" && source[index + 1] === "\n") {
    return index + 2;
  }

  if (source[index] === "\n" || source[index] === "\r") {
    return index + 1;
  }

  return index;
}
