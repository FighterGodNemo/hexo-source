#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function normalizeToPosix(input) {
  return String(input || '').replace(/\\/g, '/');
}

function detectLineEnding(text) {
  return String(text || '').includes('\r\n') ? '\r\n' : '\n';
}

function stripQuotes(value) {
  const trimmed = String(value || '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function quoteYamlSingle(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function listMarkdownFiles(rootDir) {
  const results = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        results.push(fullPath);
      }
    }
  }

  if (fs.existsSync(rootDir)) {
    walk(rootDir);
  }

  results.sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return results;
}

function parseFrontMatter(text) {
  const match = String(text || '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  return {
    raw: match[0],
    body: match[1]
  };
}

function extractScalar(frontMatterBody, key) {
  const regex = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm');
  const match = String(frontMatterBody || '').match(regex);
  return match ? stripQuotes(match[1]) : null;
}

function extractDateParts(value) {
  if (!value) return null;

  const direct = String(value).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (direct) {
    return {
      year: direct[1],
      month: direct[2],
      day: direct[3]
    };
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      year: String(parsed.getFullYear()),
      month: String(parsed.getMonth() + 1).padStart(2, '0'),
      day: String(parsed.getDate()).padStart(2, '0')
    };
  }

  return null;
}

function resolveDateParts(frontMatterBody, fileStat) {
  const explicitDate = extractScalar(frontMatterBody, 'date');
  const createdDate = extractScalar(frontMatterBody, 'created');

  const parts =
    extractDateParts(explicitDate) ||
    extractDateParts(createdDate);

  if (parts) return parts;

  const fallback = fileStat.birthtimeMs ? fileStat.birthtime : fileStat.mtime;
  return {
    year: String(fallback.getFullYear()),
    month: String(fallback.getMonth() + 1).padStart(2, '0'),
    day: String(fallback.getDate()).padStart(2, '0')
  };
}

function buildPermalink(filePath, postsRoot, frontMatterBody, fileStat) {
  const relativeStem = normalizeToPosix(path.relative(postsRoot, filePath)).replace(/\.md$/i, '');
  const dateParts = resolveDateParts(frontMatterBody, fileStat);
  return `/${dateParts.year}/${dateParts.month}/${dateParts.day}/${relativeStem}/`;
}

function upsertPermalink(text, permalink) {
  const lineEnding = detectLineEnding(text);
  const frontMatter = parseFrontMatter(text);

  if (!frontMatter) {
    return [
      '---',
      `permalink: ${quoteYamlSingle(permalink)}`,
      '---',
      '',
      text
    ].join(lineEnding);
  }

  const lines = frontMatter.body.split(/\r?\n/);
  const existingIndex = lines.findIndex(line => /^permalink:\s*/.test(line));

  if (existingIndex >= 0) {
    lines[existingIndex] = `permalink: ${quoteYamlSingle(permalink)}`;
  } else {
    const anchorOrder = ['title', 'date', 'created'];
    let insertAt = lines.length;

    for (const key of anchorOrder) {
      const index = lines.findIndex(line => new RegExp(`^${key}:\\s*`).test(line));
      if (index >= 0) {
        insertAt = index + 1;
        break;
      }
    }

    lines.splice(insertAt, 0, `permalink: ${quoteYamlSingle(permalink)}`);
  }

  const rebuiltFrontMatter = `---${lineEnding}${lines.join(lineEnding)}${lineEnding}---`;
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---/, rebuiltFrontMatter);
}

function syncPermalinks(options) {
  const { postsRoot, write = true, logger = console } = options;
  const files = listMarkdownFiles(postsRoot);
  const updatedFiles = [];
  const errors = [];

  for (const filePath of files) {
    try {
      const original = fs.readFileSync(filePath, 'utf8');
      const frontMatter = parseFrontMatter(original);
      const frontMatterBody = frontMatter ? frontMatter.body : '';
      const currentPermalink = extractScalar(frontMatterBody, 'permalink');

      if (currentPermalink) continue;

      const permalink = buildPermalink(filePath, postsRoot, frontMatterBody, fs.statSync(filePath));
      const next = upsertPermalink(original, permalink);

      if (write && next !== original) {
        fs.writeFileSync(filePath, next, 'utf8');
      }

      updatedFiles.push({
        filePath,
        permalink
      });
    } catch (error) {
      errors.push({
        filePath,
        message: error.message
      });
    }
  }

  if (updatedFiles.length && logger && typeof logger.info === 'function') {
    logger.info(`[permalink] Added fixed permalinks to ${updatedFiles.length} post(s).`);
  }

  return {
    checkedCount: files.length,
    updatedFiles,
    errors
  };
}

function validatePermalinks(options) {
  const { postsRoot } = options;
  const files = listMarkdownFiles(postsRoot);
  const missing = [];
  const invalid = [];
  const duplicateMap = new Map();

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf8');
    const frontMatter = parseFrontMatter(original);
    const frontMatterBody = frontMatter ? frontMatter.body : '';
    const permalink = extractScalar(frontMatterBody, 'permalink');

    if (!permalink) {
      missing.push(filePath);
      continue;
    }

    if (!/^\/.*\/$/.test(permalink)) {
      invalid.push({
        filePath,
        permalink,
        reason: 'Permalink must start and end with /.'
      });
    }

    const duplicates = duplicateMap.get(permalink) || [];
    duplicates.push(filePath);
    duplicateMap.set(permalink, duplicates);
  }

  const duplicates = [];
  for (const [permalink, filePaths] of duplicateMap.entries()) {
    if (filePaths.length > 1) {
      duplicates.push({ permalink, filePaths });
    }
  }

  return {
    checkedCount: files.length,
    missing,
    invalid,
    duplicates
  };
}

function formatValidationReport(report) {
  const lines = ['Permalink validation failed.'];

  if (report.missing.length) {
    lines.push(`Missing permalink: ${report.missing.length}`);
    for (const filePath of report.missing.slice(0, 10)) {
      lines.push(`  - ${filePath}`);
    }
  }

  if (report.invalid.length) {
    lines.push(`Invalid permalink: ${report.invalid.length}`);
    for (const item of report.invalid.slice(0, 10)) {
      lines.push(`  - ${item.filePath} -> ${item.permalink} (${item.reason})`);
    }
  }

  if (report.duplicates.length) {
    lines.push(`Duplicate permalink: ${report.duplicates.length}`);
    for (const item of report.duplicates.slice(0, 10)) {
      lines.push(`  - ${item.permalink}`);
      for (const filePath of item.filePaths) {
        lines.push(`    ${filePath}`);
      }
    }
  }

  return lines.join('\n');
}

function main() {
  const args = new Set(process.argv.slice(2));
  const cwd = process.cwd();
  const postsRoot = path.join(cwd, 'source', '_posts');

  if (!fs.existsSync(postsRoot)) {
    console.error(`Posts directory not found: ${postsRoot}`);
    process.exit(1);
  }

  if (args.has('--write')) {
    const syncReport = syncPermalinks({ postsRoot, write: true, logger: console });
    if (syncReport.errors.length) {
      for (const error of syncReport.errors) {
        console.error(`${error.filePath}: ${error.message}`);
      }
      process.exit(1);
    }
  }

  const validationReport = validatePermalinks({ postsRoot });
  if (
    validationReport.missing.length ||
    validationReport.invalid.length ||
    validationReport.duplicates.length
  ) {
    console.error(formatValidationReport(validationReport));
    process.exit(1);
  }

  console.log(`[permalink] Verified ${validationReport.checkedCount} post(s).`);
}

module.exports = {
  buildPermalink,
  formatValidationReport,
  syncPermalinks,
  validatePermalinks
};

if (require.main === module) {
  main();
}
