const { formatSecurityReport, validateSecurity } = require('../tools/security-audit');

hexo.extend.filter.register('before_generate', function () {
  const report = validateSecurity({
    siteRoot: hexo.base_dir,
    themeConfig: hexo.theme && hexo.theme.config
  });

  if (report.findings.length) {
    throw new Error(formatSecurityReport(report));
  }

  hexo.log.info(`[security] Verified ${report.scannedFiles.length} config file(s) before generate.`);
});
