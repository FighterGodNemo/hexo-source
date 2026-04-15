#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GITHUB_PATTERNS = [
  {
    id: 'github-classic-pat',
    regex: /\bghp_[A-Za-z0-9]{20,}\b/g,
    message: 'GitHub personal access tokens must not be stored in repository files.'
  },
  {
    id: 'github-fine-grained-pat',
    regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
    message: 'GitHub personal access tokens must not be stored in repository files.'
  }
];

function extractIndentedBlock(text, key) {
  const match = String(text || '').match(
    new RegExp(`^${key}:\\s*\\r?\\n((?:^[ \\t].*\\r?\\n?)*)`, 'm')
  );

  return match ? match[1] : '';
}

function extractYamlScalar(blockText, key) {
  const match = String(blockText || '').match(
    new RegExp(`^[ \\t]+${key}:[ \\t]*(.*?)\\s*$`, 'm')
  );

  if (!match) return '';

  const value = String(match[1] || '').trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }

  return value;
}

function includesGitalkUse(text) {
  const commentsBlock = extractIndentedBlock(text, 'comments');
  return /^[ \t]+-\s*Gitalk\s*$/m.test(commentsBlock);
}

function getLineNumber(text, index) {
  return String(text || '').slice(0, index).split(/\r?\n/).length;
}

function scanForGithubTokens(filePath, text) {
  const findings = [];

  for (const pattern of GITHUB_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;

    while ((match = pattern.regex.exec(text)) !== null) {
      findings.push({
        ruleId: pattern.id,
        filePath,
        line: getLineNumber(text, match.index),
        message: pattern.message
      });
    }
  }

  return findings;
}

function validateSecurity(options = {}) {
  const {
    siteRoot = process.cwd(),
    themeConfig = null
  } = options;

  const findings = [];
  const scannedFiles = [];

  const themeConfigPath = path.join(siteRoot, '_config.butterfly.yml');
  if (fs.existsSync(themeConfigPath)) {
    const themeConfigText = fs.readFileSync(themeConfigPath, 'utf8');
    scannedFiles.push(themeConfigPath);

    const gitalkBlock = extractIndentedBlock(themeConfigText, 'gitalk');
    const configuredSecret = extractYamlScalar(gitalkBlock, 'client_secret');
    const configuredClientId = extractYamlScalar(gitalkBlock, 'client_id');
    const usesGitalkFromFile = includesGitalkUse(themeConfigText);
    const usesGitalkFromConfig = Array.isArray(themeConfig?.comments?.use)
      ? themeConfig.comments.use.includes('Gitalk')
      : false;
    const usesGitalk = usesGitalkFromConfig || usesGitalkFromFile;

    if (usesGitalk) {
      findings.push({
        ruleId: 'gitalk-static-secret',
        filePath: themeConfigPath,
        line: 555,
        message:
          'Gitalk is not allowed for this GitHub Pages site because it requires exposing a GitHub OAuth client secret in browser-delivered HTML.'
      });
    }

    if (configuredSecret) {
      findings.push({
        ruleId: 'gitalk-client-secret-present',
        filePath: themeConfigPath,
        line: 595,
        message:
          'gitalk.client_secret is configured in theme config. Secrets must never be stored in this repository or rendered into static pages.'
      });
    }

    if (usesGitalk && !configuredClientId) {
      findings.push({
        ruleId: 'gitalk-misconfigured',
        filePath: themeConfigPath,
        line: 593,
        message:
          'Gitalk is enabled but its configuration is incomplete. Use a secret-free comment system such as Utterances or Giscus instead.'
      });
    }
  }

  const rootFilesToScan = ['_config.yml', '_config.butterfly.yml', 'package.json'];
  for (const relativePath of rootFilesToScan) {
    const absolutePath = path.join(siteRoot, relativePath);
    if (!fs.existsSync(absolutePath)) continue;

    const text = fs.readFileSync(absolutePath, 'utf8');
    if (!scannedFiles.includes(absolutePath)) {
      scannedFiles.push(absolutePath);
    }
    findings.push(...scanForGithubTokens(absolutePath, text));
  }

  return {
    scannedFiles,
    findings
  };
}

function formatSecurityReport(report) {
  const lines = ['Security validation failed.'];

  for (const item of report.findings) {
    lines.push(`- [${item.ruleId}] ${item.filePath}:${item.line} ${item.message}`);
  }

  return lines.join('\n');
}

if (require.main === module) {
  const report = validateSecurity({ siteRoot: process.cwd() });

  if (report.findings.length) {
    console.error(formatSecurityReport(report));
    process.exitCode = 1;
  } else {
    console.log(`[security] Verified ${report.scannedFiles.length} file(s).`);
  }
}

module.exports = {
  formatSecurityReport,
  validateSecurity
};
