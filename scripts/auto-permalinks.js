const path = require('path');
const {
  formatValidationReport,
  syncPermalinks,
  validatePermalinks
} = require('../tools/permalink-manager');

const postsRoot = path.join(hexo.source_dir, '_posts');

const syncReport = syncPermalinks({
  postsRoot,
  write: true,
  logger: hexo.log
});

if (syncReport.errors.length) {
  throw new Error(
    syncReport.errors
      .map(item => `${item.filePath}: ${item.message}`)
      .join('\n')
  );
}

hexo.extend.filter.register('before_generate', function () {
  const report = validatePermalinks({ postsRoot });

  if (report.missing.length || report.invalid.length || report.duplicates.length) {
    throw new Error(formatValidationReport(report));
  }

  hexo.log.info(`[permalink] Verified ${report.checkedCount} post(s) before generate.`);
});
